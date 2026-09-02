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
import {
  getProgress,
  getRun,
  recommendNext,
  recordSession,
  resetRun,
  type Progress,
} from "@/lib/store";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso — OCUPAMOR" },
      {
        name: "description",
        content:
          "Puntos, aciertos por categoría, usos de calma sensorial y recomendaciones para la próxima sesión.",
      },
      { property: "og:title", content: "Mi progreso — OCUPAMOR" },
      {
        property: "og:description",
        content: "Mira todo lo que ya lograste y qué practicar después.",
      },
    ],
  }),
  component: ProgresoScreen,
});

function ProgresoScreen() {
  const user = useSessionUser();
  const [p, setP] = useState<Progress | null>(null);
  const [reco, setReco] = useState<string[]>([]);
  const [run, setRun] = useState(() => ({ total: 0, correct: 0, sensoryUsed: false }));

  useEffect(() => {
    if (!user) return;
    setP(getProgress(user.email));
    setReco(recommendNext(user.email));
    setRun(getRun());
  }, [user]);

  function cerrarSesionDeJuego() {
    if (!user) return;
    const r = getRun();
    if (r.total === 0) {
      showToast("Aún no hay actividades en esta sesión");
      return;
    }
    recordSession(user.email, r.total, r.correct, r.sensoryUsed);
    resetRun();
    setRun(getRun());
    setP(getProgress(user.email));
    showToast("Sesión guardada");
    say("Sesión guardada. Buen trabajo.");
  }

  if (!p) {
    return (
      <Screen title="Mi Progreso" subtitle="Cargando...">
        <Card tone="soft">
          <SoftLabel size="sm" muted>
            Preparando tus datos...
          </SoftLabel>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen title="Mi Progreso" subtitle="Lo que ya lograste">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Puntos" value={p.points} />
        <Stat label="Sesiones" value={p.sessions.length} />
        <Stat label="Calma" value={p.sensory_uses} />
      </div>

      <Card className="space-y-2" border>
        <SoftLabel bold size="lg">
          Sesión en curso
        </SoftLabel>
        <SoftLabel size="sm" muted>
          {run.correct} correctas de {run.total} actividades
          {run.sensoryUsed ? " · usó calma sensorial" : ""}
        </SoftLabel>
        <PrimaryButton tone="secondary" onClick={cerrarSesionDeJuego}>
          Guardar sesión
        </PrimaryButton>
      </Card>

      <SoftLabel bold size="lg">
        Desempeño por área
      </SoftLabel>
      {LEARNING_CATEGORIES.map(([k, label]) => {
        const t = p.totals[k] ?? { ok: 0, fail: 0 };
        const total = t.ok + t.fail;
        const pct = total ? Math.round((t.ok / total) * 100) : 0;
        return (
          <Card key={k} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <SoftLabel bold size="sm">
                {label}
              </SoftLabel>
              <SoftLabel size="xs" muted>
                {t.ok} ✓ / {t.fail} ↻
              </SoftLabel>
            </div>
            <Bar pct={pct} />
          </Card>
        );
      })}

      <Card tone="calm" className="space-y-1">
        <SoftLabel bold size="lg" className="text-calm-foreground">
          Sugerencias para la próxima vez
        </SoftLabel>
        {reco.map((r) => (
          <p key={r} className="text-sm text-calm-foreground/90">
            • {r}
          </p>
        ))}
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rise-in rounded-3xl bg-primary p-3 text-center text-primary-foreground">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] opacity-90">{label}</p>
    </div>
  );
}
