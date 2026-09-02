import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  AudioButton,
  Card,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { SILABAS } from "@/data/content";
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
          "Sílabas agrupadas por consonante con voz en español para repetir y practicar la lectura con calma.",
      },
      { property: "og:title", content: "Sílabas por consonante — OCUPAMOR" },
      {
        property: "og:description",
        content: "Practica ma-me-mi-mo-mu y los demás grupos silábicos con audio.",
      },
    ],
  }),
  component: SilabasScreen,
});

function SilabasScreen() {
  const user = useSessionUser();

  const grupos = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of SILABAS) {
      const key = s[0].toUpperCase();
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()];
  }, []);

  const [open, setOpen] = useState(grupos[0]?.[0] ?? "M");
  const actual = grupos.find(([k]) => k === open);

  return (
    <Screen title="Sílabas" subtitle="Practica grupo por grupo">
      <SoftLabel size="sm" muted>
        Elige una consonante y toca cada sílaba para escucharla.
      </SoftLabel>

      <div className="flex flex-wrap gap-2">
        {grupos.map(([k]) => (
          <button
            key={k}
            type="button"
            onClick={() => setOpen(k)}
            className={cn(
              "min-h-11 min-w-11 rounded-2xl px-3 text-base font-bold transition active:opacity-80",
              k === open
                ? "bg-primary text-primary-foreground"
                : "bg-soft text-foreground",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      {actual && (
        <Card>
          <SoftLabel bold size="lg">
            Sílabas con {actual[0]}
          </SoftLabel>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {actual[1].map((s, i) => (
              <div
                key={s}
                className="rise-in flex flex-col items-center gap-2 rounded-3xl bg-soft-2 p-3"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <button
                  type="button"
                  onClick={() => {
                    say(s);
                    trackActivity(user?.email, "silabas", true);
                  }}
                  className="text-2xl font-bold text-primary active:opacity-70"
                >
                  {s}
                </button>
                <AudioButton
                  text={s}
                  label="Oír"
                  tone="calm"
                  onPlayed={() => trackActivity(user?.email, "silabas", true)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}
    </Screen>
  );
}
