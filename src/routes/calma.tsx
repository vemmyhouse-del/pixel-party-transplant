import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  Card,
  PrimaryButton,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { say, stopSpeaking } from "@/lib/speech";
import { markSensoryUsed, trackActivity } from "@/lib/store";

export const Route = createFileRoute("/calma")({
  head: () => ({
    meta: [
      { title: "Calma sensorial — OCUPAMOR" },
      {
        name: "description",
        content:
          "Ejercicio guiado de respiración con animación suave y voz para bajar revoluciones y regular el cuerpo.",
      },
      { property: "og:title", content: "Calma sensorial — OCUPAMOR" },
      {
        property: "og:description",
        content: "Respira con la guía visual y sonora: inhala, sostén, exhala.",
      },
    ],
  }),
  component: CalmaScreen,
});

type Fase = "inhala" | "sosten" | "exhala";

const SECUENCIA: Array<{ fase: Fase; segundos: number; texto: string }> = [
  { fase: "inhala", segundos: 4, texto: "Inhala despacio por la nariz" },
  { fase: "sosten", segundos: 2, texto: "Sostén el aire" },
  { fase: "exhala", segundos: 6, texto: "Exhala muy suave por la boca" },
];

function CalmaScreen() {
  const user = useSessionUser();
  const [activo, setActivo] = useState(false);
  const [paso, setPaso] = useState(0);
  const [restante, setRestante] = useState(SECUENCIA[0]!.segundos);
  const [ciclos, setCiclos] = useState(0);
  const dicho = useRef<number>(-1);

  const actual = SECUENCIA[paso] ?? SECUENCIA[0]!;


  useEffect(() => {
    if (!activo) return;
    const id = window.setInterval(() => {
      setRestante((r) => {
        if (r > 1) return r - 1;
        setPaso((p) => {
          const next = (p + 1) % SECUENCIA.length;
          if (next === 0) setCiclos((c) => c + 1);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [activo]);

  useEffect(() => {
    if (!activo) return;
    const step = SECUENCIA[paso] ?? SECUENCIA[0]!;
    setRestante(step.segundos);
    if (dicho.current !== paso) {
      dicho.current = paso;
      say(step.texto);

    }
  }, [paso, activo]);

  useEffect(() => () => stopSpeaking(), []);

  function iniciar() {
    setActivo(true);
    setPaso(0);
    setCiclos(0);
    dicho.current = -1;
    markSensoryUsed();
    trackActivity(user?.email, "calma", true);
  }

  function detener() {
    setActivo(false);
    stopSpeaking();
  }

  const escala =
    actual.fase === "inhala" ? "scale-100" : actual.fase === "sosten" ? "scale-95" : "scale-[0.62]";
  const imagen = actual.fase === "exhala" ? "exhalar.png" : "inhalar.png";

  return (
    <Screen title="Calma Sensorial" subtitle="Respirar y bajar revoluciones">
      <Card tone="calm" className="space-y-4 text-center">
        <SoftLabel bold size="xl" className="text-calm-foreground">
          {activo ? actual.texto : "Vamos a respirar juntos"}
        </SoftLabel>

        <div className="flex items-center justify-center py-2">
          <div
            className={`flex h-56 w-56 items-center justify-center rounded-full bg-card transition-transform duration-1000 ease-in-out ${activo ? escala : "scale-90"}`}
          >
            <img
              src={`/assets/images/${imagen}`}
              alt={actual.fase === "exhala" ? "Exhalar" : "Inhalar"}
              className="h-40 w-40 object-contain"
            />
          </div>
        </div>

        <p className="text-5xl font-bold text-calm-foreground">
          {activo ? restante || actual.segundos : "•"}
        </p>
        <SoftLabel size="sm" className="text-calm-foreground/90">
          Ciclos completados: {ciclos}
        </SoftLabel>
      </Card>

      {activo ? (
        <PrimaryButton tone="card" big onClick={detener}>
          Terminar por ahora
        </PrimaryButton>
      ) : (
        <PrimaryButton big onClick={iniciar}>
          Empezar la respiración
        </PrimaryButton>
      )}

      <Card border>
        <SoftLabel bold>Otras ideas para calmarte</SoftLabel>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• Aprieta y suelta los puños cinco veces.</li>
          <li>• Busca cinco cosas azules a tu alrededor.</li>
          <li>• Abraza un cojín y cuenta hasta diez.</li>
          <li>• Pide ayuda con la seña de "Necesito ayuda".</li>
        </ul>
      </Card>
    </Screen>
  );
}
