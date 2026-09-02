import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  Bar,
  Card,
  PrimaryButton,
  Screen,
  SoftLabel,
  showToast,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { LEARNING_CATEGORIES } from "@/data/content";
import { say } from "@/lib/speech";
import { addMission, getMissions, saveMissions, type Mission } from "@/lib/store";

export const Route = createFileRoute("/misiones")({
  head: () => ({
    meta: [
      { title: "Misiones y retos del día — OCUPAMOR" },
      {
        name: "description",
        content:
          "Crea retos cortos por categoría y observa cómo avanzan solos mientras el niño practica en la aplicación.",
      },
      { property: "og:title", content: "Misiones y retos del día — OCUPAMOR" },
      {
        property: "og:description",
        content: "Retos cortos que se completan practicando cada actividad.",
      },
    ],
  }),
  component: MisionesScreen,
});

function MisionesScreen() {
  const user = useSessionUser();
  const [misiones, setMisiones] = useState<Mission[]>([]);
  const [titulo, setTitulo] = useState("");
  const [meta, setMeta] = useState(5);
  const [cat, setCat] = useState(LEARNING_CATEGORIES[0]![0]);

  useEffect(() => {
    if (user) setMisiones(getMissions(user.email));
  }, [user]);

  function crear() {
    if (!user) return;
    if (titulo.trim().length < 3) {
      showToast("Escribe un título para la misión");
      return;
    }
    addMission(user.email, titulo.trim(), meta, cat);
    setMisiones(getMissions(user.email));
    setTitulo("");
    showToast("Misión creada");
    say("Misión creada");
  }

  function borrar(id: number) {
    if (!user) return;
    const next = misiones.filter((m) => m.id !== id);
    saveMissions(user.email, next);
    setMisiones(next);
  }

  const inputClass =
    "min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary";

  return (
    <Screen title="Misiones" subtitle="Retos cortos del día">
      <Card className="space-y-3">
        <SoftLabel bold size="lg">
          Nueva misión
        </SoftLabel>
        <input
          className={inputClass}
          placeholder="Ej. Practicar 5 sílabas"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            className={inputClass}
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {LEARNING_CATEGORIES.map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
          <input
            className={`${inputClass} w-24 shrink-0 text-center`}
            type="number"
            min={1}
            value={meta}
            onChange={(e) => setMeta(Number(e.target.value) || 1)}
          />
        </div>
        <PrimaryButton big onClick={crear}>
          Crear misión
        </PrimaryButton>
      </Card>

      <SoftLabel bold size="lg">
        Tus misiones
      </SoftLabel>

      {misiones.length === 0 && (
        <Card tone="soft">
          <SoftLabel size="sm" muted>
            Todavía no hay misiones. Crea la primera arriba.
          </SoftLabel>
        </Card>
      )}

      {misiones.map((m) => {
        const pct = Math.round((m.progress / m.target) * 100);
        return (
          <Card key={m.id} className="space-y-2" border>
            <div className="flex items-start justify-between gap-2">
              <SoftLabel bold>{m.title}</SoftLabel>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${m.done ? "bg-soft-2" : "bg-soft"}`}
              >
                {m.done ? "Completada" : `${m.progress}/${m.target}`}
              </span>
            </div>
            <Bar pct={pct} tone={m.done ? "bg-secondary" : "bg-primary"} />
            <SoftLabel size="xs" muted>
              Categoría:{" "}
              {LEARNING_CATEGORIES.find(([k]) => k === m.category)?.[1] ??
                m.category}
            </SoftLabel>
            <PrimaryButton tone="soft" onClick={() => borrar(m.id)}>
              Eliminar
            </PrimaryButton>
          </Card>
        );
      })}
    </Screen>
  );
}
