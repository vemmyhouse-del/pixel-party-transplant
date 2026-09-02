import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  AudioButton,
  Card,
  PrimaryButton,
  Screen,
  SoftLabel,
  showToast,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { FIGURAS, NUMEROS } from "@/data/content";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/matematicas")({
  head: () => ({
    meta: [
      { title: "Matemáticas: números, sumas y figuras — OCUPAMOR" },
      {
        name: "description",
        content:
          "Cuenta del 0 al 20, resuelve sumas simples y reconoce figuras geométricas con imágenes y voz en español.",
      },
      {
        property: "og:title",
        content: "Matemáticas: números, sumas y figuras — OCUPAMOR",
      },
      {
        property: "og:description",
        content: "Números, sumas y figuras con apoyo visual y auditivo.",
      },
    ],
  }),
  component: MatematicasScreen,
});

type Tab = "numeros" | "sumas" | "figuras";

function MatematicasScreen() {
  const [tab, setTab] = useState<Tab>("numeros");

  const tabs: Array<[Tab, string]> = [
    ["numeros", "Números"],
    ["sumas", "Sumas"],
    ["figuras", "Figuras"],
  ];

  return (
    <Screen title="Matemáticas" subtitle="Números, sumas y figuras">
      <div className="flex gap-2">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "min-h-11 flex-1 rounded-full text-sm font-bold transition active:opacity-80",
              tab === k
                ? "bg-primary text-primary-foreground"
                : "bg-soft text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "numeros" && <Numeros />}
      {tab === "sumas" && <Sumas />}
      {tab === "figuras" && <Figuras />}
    </Screen>
  );
}

function Numeros() {
  const user = useSessionUser();
  return (
    <>
      <SoftLabel size="sm" muted>
        Toca un número para escuchar cómo se dice.
      </SoftLabel>
      <div className="grid grid-cols-3 gap-3">
        {NUMEROS.map(([n, nombre], i) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              say(`${n}, ${nombre}`);
              trackActivity(user?.email, "matematicas", true);
            }}
            className="rise-in flex flex-col items-center rounded-3xl bg-card p-3 active:opacity-80"
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <span className="text-3xl font-bold text-primary">{n}</span>
            <span className="text-xs text-muted-foreground">{nombre}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function nuevaSuma() {
  const a = Math.floor(Math.random() * 6);
  const b = Math.floor(Math.random() * 6);
  const correcta = a + b;
  const opciones = new Set<number>([correcta]);
  while (opciones.size < 3) {
    opciones.add(Math.max(0, correcta + Math.floor(Math.random() * 7) - 3));
  }
  return {
    a,
    b,
    correcta,
    opciones: [...opciones].sort(() => Math.random() - 0.5),
  };
}

function Sumas() {
  const user = useSessionUser();
  const [q, setQ] = useState(nuevaSuma);
  const [aciertos, setAciertos] = useState(0);

  function responder(op: number) {
    const ok = op === q.correcta;
    trackActivity(user?.email, "matematicas", ok);
    if (ok) {
      setAciertos((a) => a + 1);
      say(`Muy bien. ${q.a} más ${q.b} es ${q.correcta}`);
      showToast("¡Correcto!");
      setQ(nuevaSuma());
    } else {
      say("Casi. Vuelve a intentarlo con calma.");
      showToast("Inténtalo otra vez");
    }
  }

  return (
    <>
      <Card className="space-y-3 text-center">
        <SoftLabel size="sm" muted>
          Aciertos: {aciertos}
        </SoftLabel>
        <p className="text-4xl font-bold text-primary">
          {q.a} + {q.b} = ?
        </p>
        <div className="flex items-center justify-center gap-1 text-3xl">
          {"🍎".repeat(q.a)}
          <span className="px-1 text-xl text-muted-foreground">+</span>
          {"🍏".repeat(q.b)}
        </div>
        <AudioButton
          text={`Cuánto es ${q.a} más ${q.b}`}
          label="Oír la pregunta"
          tone="secondary"
          className="mx-auto"
        />
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {q.opciones.map((op) => (
          <PrimaryButton key={op} tone="calm" big onClick={() => responder(op)}>
            {op}
          </PrimaryButton>
        ))}
      </div>
      <PrimaryButton tone="soft" onClick={() => setQ(nuevaSuma())}>
        Otra suma
      </PrimaryButton>
    </>
  );
}

function Figuras() {
  const user = useSessionUser();
  const figuras = useMemo(() => FIGURAS, []);
  return (
    <>
      <SoftLabel size="sm" muted>
        Toca una figura para escuchar su nombre y su pista.
      </SoftLabel>
      <div className="grid grid-cols-2 gap-3">
        {figuras.map(([nombre, pista, img], i) => (
          <button
            key={nombre}
            type="button"
            onClick={() => {
              say(`${nombre}. ${pista}`);
              trackActivity(user?.email, "matematicas", true);
            }}
            className="rise-in flex flex-col items-center gap-1 rounded-3xl bg-card p-3 active:opacity-80"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <img
              src={`/assets/images/figuras/${img}`}
              alt={nombre}
              loading="lazy"
              className="h-28 w-28 object-contain"
            />
            <span className="text-base font-bold text-primary">{nombre}</span>
            <span className="text-[11px] text-muted-foreground">{pista}</span>
          </button>
        ))}
      </div>
    </>
  );
}
