import { createFileRoute } from "@tanstack/react-router";

import {
  AudioButton,
  Card,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { SENAS, SENAS_IMG } from "@/data/content";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";

export const Route = createFileRoute("/senas")({
  head: () => ({
    meta: [
      { title: "Señas y comunicación — OCUPAMOR" },
      {
        name: "description",
        content:
          "Frases esenciales en señas: pedir ayuda, agua, baño, expresar cansancio o alegría, con gesto explicado y voz.",
      },
      { property: "og:title", content: "Señas y comunicación — OCUPAMOR" },
      {
        property: "og:description",
        content: "Aprende a pedir y responder con señas simples y claras.",
      },
    ],
  }),
  component: SenasScreen,
});

function SenasScreen() {
  const user = useSessionUser();

  return (
    <Screen title="Señas y Comunicación" subtitle="Aprender a pedir y responder">
      <SoftLabel size="sm" muted>
        Cada tarjeta muestra la seña, cómo hacer el gesto y cuándo usarla.
      </SoftLabel>

      {SENAS.map((s, i) => (
        <Card key={s.frase} className="space-y-2" border>
          <div className="flex items-center gap-3">
            {SENAS_IMG[s.frase] && (
              <img
                src={`/assets/images/senas/${SENAS_IMG[s.frase]}`}
                alt={`Seña para ${s.frase}`}
                loading="lazy"
                className="h-24 w-24 shrink-0 rounded-2xl bg-soft object-contain"
                style={{ animationDelay: `${i * 30}ms` }}
              />
            )}
            <div className="min-w-0">
              <p className="text-2xl">{s.emoji}</p>
              <SoftLabel bold size="lg">
                {s.frase}
              </SoftLabel>
            </div>
          </div>
          <SoftLabel size="sm">
            <span className="font-bold">Gesto: </span>
            {s.gesto}
          </SoftLabel>
          <SoftLabel size="sm" muted>
            <span className="font-bold">Cuándo: </span>
            {s.uso}
          </SoftLabel>
          <div className="flex flex-wrap gap-2">
            <AudioButton
              text={s.frase}
              label="Oír la frase"
              tone="secondary"
              onPlayed={() => trackActivity(user?.email, "senas", true)}
            />
            <AudioButton
              text={s.gesto}
              label="Oír el gesto"
              tone="calm"
              onPlayed={() => {
                say("");
                trackActivity(user?.email, "senas", true);
              }}
            />
          </div>
        </Card>
      ))}
    </Screen>
  );
}
