import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  AudioButton,
  Card,
  Screen,
  SoftLabel,
  showToast,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { EMOCIONES, EMOCIONES_IMG } from "@/data/content";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emociones")({
  head: () => ({
    meta: [
      { title: "Emociones — OCUPAMOR" },
      {
        name: "description",
        content:
          "Reconoce cómo te sientes: feliz, triste, enojado, con miedo, tranquilo o abrumado, con imagen y voz.",
      },
      { property: "og:title", content: "Emociones — OCUPAMOR" },
      {
        property: "og:description",
        content: "Identificar y nombrar emociones con apoyo visual y auditivo.",
      },
    ],
  }),
  component: EmocionesScreen,
});

function EmocionesScreen() {
  const user = useSessionUser();
  const [elegida, setElegida] = useState<string | null>(null);

  function elegir(nombre: string) {
    setElegida(nombre);
    say(`Te sientes ${nombre}. Gracias por contarlo.`);
    trackActivity(user?.email, "emociones", true);
    showToast("Gracias por contar cómo te sientes");
  }

  return (
    <Screen title="Emociones" subtitle="Reconocer cómo me siento">
      <SoftLabel size="sm" muted>
        Toca la carita que se parece a lo que sientes ahora.
      </SoftLabel>

      <div className="grid grid-cols-2 gap-3">
        {EMOCIONES.map(([emoji, nombre], i) => (
          <button
            key={nombre}
            type="button"
            onClick={() => elegir(nombre)}
            className={cn(
              "rise-in flex flex-col items-center gap-1 rounded-3xl border p-3 transition active:scale-[0.98] active:opacity-80",
              elegida === nombre
                ? "border-primary bg-soft-3"
                : "border-border bg-card",
            )}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {EMOCIONES_IMG[nombre] ? (
              <img
                src={`/assets/images/emociones/${EMOCIONES_IMG[nombre]}`}
                alt={nombre}
                loading="lazy"
                className="h-28 w-28 object-contain"
              />
            ) : (
              <span className="text-5xl">{emoji}</span>
            )}
            <span className="text-base font-bold text-primary">{nombre}</span>
          </button>
        ))}
      </div>

      {elegida && (
        <Card tone="calm" className="space-y-2">
          <SoftLabel bold size="lg" className="text-calm-foreground">
            Te sientes {elegida}
          </SoftLabel>
          <p className="text-sm text-calm-foreground/90">
            Está bien sentirse así. Respira despacio y cuéntalo a un adulto de
            confianza.
          </p>
          <AudioButton
            text={`Te sientes ${elegida}. Está bien sentirse así. Respira despacio.`}
            label="Escuchar mensaje"
            tone="card"
          />
        </Card>
      )}
    </Screen>
  );
}
