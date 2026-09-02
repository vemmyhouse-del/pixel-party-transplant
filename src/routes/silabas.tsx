import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  AudioButton,
  Card,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { SILABAS_GRUPOS } from "@/data/content";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/silabas")({
  head: () => ({
    meta: [
      { title: "Sílabas por consonante — OCUPAMOR" },
      {
        name: "description",
        content:
          "Todas las sílabas agrupadas por consonante, con voz en español para repetir y practicar la lectura.",
      },
      { property: "og:title", content: "Sílabas por consonante — OCUPAMOR" },
      {
        property: "og:description",
        content: "Practica ba-be-bi-bo-bu y todos los grupos silábicos con audio.",
      },
    ],
  }),
  component: SilabasScreen,
});

function SilabasScreen() {
  const user = useSessionUser();
  const [open, setOpen] = useState(SILABAS_GRUPOS[0]?.consonante ?? "");

  return (
    <Screen title="Sílabas" subtitle="Practica grupo por grupo">
      <SoftLabel size="sm" muted>
        Elige una consonante y toca cada sílaba para escucharla.
      </SoftLabel>

      <div className="flex flex-wrap gap-2">
        {SILABAS_GRUPOS.map((g) => (
          <button
            key={g.consonante}
            type="button"
            onClick={() => setOpen(g.consonante)}
            className={cn(
              "min-h-11 min-w-11 rounded-2xl px-3 text-base font-bold transition active:opacity-80",
              g.consonante === open
                ? "bg-primary text-primary-foreground"
                : "bg-soft text-foreground",
            )}
          >
            {g.consonante}
          </button>
        ))}
      </div>

      {SILABAS_GRUPOS.filter((g) => g.consonante === open).map((g) => (
        <Card key={g.consonante}>
          <SoftLabel bold size="lg">
            Sílabas con {g.consonante}
          </SoftLabel>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {g.silabas.map((s, i) => (
              <div
                key={s.silaba}
                className="rise-in flex flex-col items-center gap-1 rounded-3xl bg-soft-2 p-3"
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <button
                  type="button"
                  onClick={() => {
                    say(`${s.silaba} como en ${s.palabra}`);
                    trackActivity(user?.email, "silabas", true);
                  }}
                  className="flex flex-col items-center active:opacity-70"
                >
                  <span className="text-2xl font-bold text-primary">
                    {s.silaba}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.palabra}
                  </span>
                </button>
                <AudioButton
                  text={s.silaba}
                  tone="calm"
                  onPlayed={() => trackActivity(user?.email, "silabas", true)}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Screen>
  );
}
