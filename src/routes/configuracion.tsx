import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  Card,
  PrimaryButton,
  Screen,
  SoftLabel,
  showToast,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { LEARNING_CATEGORIES } from "@/data/content";
import { say, stopSpeaking } from "@/lib/speech";
import { getSettings, saveSettings, type Settings } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — OCUPAMOR" },
      {
        name: "description",
        content:
          "Activa o desactiva áreas de aprendizaje, ajusta el tamaño de sesión y prueba la voz de la aplicación.",
      },
      { property: "og:title", content: "Configuración — OCUPAMOR" },
      {
        property: "og:description",
        content: "Ajusta las áreas de aprendizaje y el tamaño de cada sesión.",
      },
    ],
  }),
  component: ConfiguracionScreen,
});

function ConfiguracionScreen() {
  const user = useSessionUser();
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    if (user) setS(getSettings(user.email));
  }, [user]);

  if (!s) {
    return (
      <Screen title="Configuración" subtitle="Cargando...">
        <Card tone="soft">
          <SoftLabel size="sm" muted>
            Preparando los ajustes...
          </SoftLabel>
        </Card>
      </Screen>
    );
  }

  function toggle(k: string) {
    setS({ ...s!, categories: { ...s!.categories, [k]: !(s!.categories[k] ?? true) } });
  }

  function guardar() {
    if (!user || !s) return;
    saveSettings(user.email, s);
    showToast("Ajustes guardados");
    say("Ajustes guardados");
  }

  return (
    <Screen title="Configuración" subtitle="Ajustes de la aplicación">
      <Card className="space-y-3">
        <SoftLabel bold size="lg">
          Áreas de aprendizaje activas
        </SoftLabel>
        {LEARNING_CATEGORIES.map(([k, label]) => {
          const on = s.categories[k] ?? true;
          return (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-soft px-4 py-3 text-left active:opacity-80"
            >
              <span className="text-sm font-bold">{label}</span>
              <span
                className={cn(
                  "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition",
                  on ? "bg-secondary" : "bg-border",
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-full bg-card transition-transform",
                    on && "translate-x-5",
                  )}
                />
              </span>
            </button>
          );
        })}
      </Card>

      <Card className="space-y-3">
        <SoftLabel bold size="lg">
          Actividades por sesión
        </SoftLabel>
        <SoftLabel size="sm" muted>
          Recomendado: sesiones cortas de 5 a 10 actividades.
        </SoftLabel>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={3}
            max={20}
            value={s.session_size}
            onChange={(e) => setS({ ...s, session_size: Number(e.target.value) })}
            className="h-11 flex-1 accent-[var(--primary)]"
          />
          <span className="w-10 text-center text-lg font-bold text-primary">
            {s.session_size}
          </span>
        </div>
      </Card>

      <Card className="space-y-2">
        <SoftLabel bold size="lg">
          Voz de la aplicación
        </SoftLabel>
        <SoftLabel size="sm" muted>
          La voz usa el motor del dispositivo en español.
        </SoftLabel>
        <div className="flex gap-2">
          <PrimaryButton
            tone="calm"
            onClick={() => say("Hola, soy la voz de Ocupamor. Vamos a aprender con calma.")}
          >
            Probar la voz
          </PrimaryButton>
          <PrimaryButton tone="soft" onClick={() => stopSpeaking()}>
            Silenciar
          </PrimaryButton>
        </div>
      </Card>

      <PrimaryButton big onClick={guardar}>
        Guardar ajustes
      </PrimaryButton>
    </Screen>
  );
}
