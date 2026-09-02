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
import {
  buildReport,
  getMissions,
  getProgress,
  recommendNext,
  type Mission,
  type Progress,
} from "@/lib/store";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel del adulto: seguimiento y reportes — OCUPAMOR" },
      {
        name: "description",
        content:
          "Resumen para el adulto responsable: sesiones, aciertos por área, misiones y reporte descargable en texto.",
      },
      {
        property: "og:title",
        content: "Panel del adulto: seguimiento y reportes — OCUPAMOR",
      },
      {
        property: "og:description",
        content: "Seguimiento del avance y generación de reportes.",
      },
    ],
  }),
  component: PanelScreen,
});

function PanelScreen() {
  const user = useSessionUser();
  const [p, setP] = useState<Progress | null>(null);
  const [misiones, setMisiones] = useState<Mission[]>([]);
  const [reco, setReco] = useState<string[]>([]);
  const [reporte, setReporte] = useState("");

  useEffect(() => {
    if (!user) return;
    setP(getProgress(user.email));
    setMisiones(getMissions(user.email));
    setReco(recommendNext(user.email));
  }, [user]);

  function generar() {
    if (!user) return;
    setReporte(buildReport(user.email));
    showToast("Reporte generado");
  }

  function descargar() {
    if (!user) return;
    const texto = reporte || buildReport(user.email);
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_ocupamor_${user.email.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ultimas = p?.sessions.slice(-8).reverse() ?? [];

  return (
    <Screen title="Panel del Adulto" subtitle="Seguimiento y reportes">
      <Card border>
        <SoftLabel bold size="lg">
          {user?.name ?? ""}
        </SoftLabel>
        <SoftLabel size="sm" muted>
          {user?.email} · {user?.role}
        </SoftLabel>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Puntos" value={p?.points ?? 0} />
        <Stat label="Sesiones" value={p?.sessions.length ?? 0} />
        <Stat label="Calma" value={p?.sensory_uses ?? 0} />
      </div>

      <SoftLabel bold size="lg">
        Desempeño por área
      </SoftLabel>
      {LEARNING_CATEGORIES.map(([k, label]) => {
        const t = p?.totals[k] ?? { ok: 0, fail: 0 };
        const total = t.ok + t.fail;
        const pct = total ? Math.round((t.ok / total) * 100) : 0;
        return (
          <Card key={k} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <SoftLabel bold size="sm">
                {label}
              </SoftLabel>
              <SoftLabel size="xs" muted>
                {pct}% · {t.ok}/{total || 0}
              </SoftLabel>
            </div>
            <Bar pct={pct} />
          </Card>
        );
      })}

      <SoftLabel bold size="lg">
        Últimas sesiones
      </SoftLabel>
      {ultimas.length === 0 ? (
        <Card tone="soft">
          <SoftLabel size="sm" muted>
            Aún no hay sesiones guardadas.
          </SoftLabel>
        </Card>
      ) : (
        ultimas.map((s, i) => (
          <Card key={s.date + i} border>
            <SoftLabel size="sm" bold>
              {s.correct}/{s.total} correctas
              {s.sensory_used ? " · usó calma" : ""}
            </SoftLabel>
            <SoftLabel size="xs" muted>
              {new Date(s.date).toLocaleString("es")}
            </SoftLabel>
          </Card>
        ))
      )}

      <SoftLabel bold size="lg">
        Misiones
      </SoftLabel>
      {misiones.length === 0 ? (
        <Card tone="soft">
          <SoftLabel size="sm" muted>
            Sin misiones creadas.
          </SoftLabel>
        </Card>
      ) : (
        misiones.map((m) => (
          <Card key={m.id} className="space-y-2">
            <SoftLabel size="sm" bold>
              {m.title} — {m.progress}/{m.target}
            </SoftLabel>
            <Bar
              pct={Math.round((m.progress / m.target) * 100)}
              tone={m.done ? "bg-secondary" : "bg-primary"}
            />
          </Card>
        ))
      )}

      <Card tone="calm" className="space-y-1">
        <SoftLabel bold size="lg" className="text-calm-foreground">
          Recomendaciones
        </SoftLabel>
        {reco.map((r) => (
          <p key={r} className="text-sm text-calm-foreground/90">
            • {r}
          </p>
        ))}
      </Card>

      <div className="flex gap-2">
        <PrimaryButton onClick={generar}>Generar reporte</PrimaryButton>
        <PrimaryButton tone="secondary" onClick={descargar}>
          Descargar .txt
        </PrimaryButton>
      </div>

      {reporte && (
        <Card tone="soft">
          <pre className="overflow-x-auto text-[11px] leading-relaxed whitespace-pre-wrap text-foreground">
            {reporte}
          </pre>
        </Card>
      )}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rise-in rounded-3xl bg-primary-dark p-3 text-center text-primary-foreground">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] opacity-90">{label}</p>
    </div>
  );
}
