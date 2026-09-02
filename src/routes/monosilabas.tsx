import { createFileRoute } from "@tanstack/react-router";

import {
  AudioButton,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { MONOSILABAS } from "@/data/content";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";

export const Route = createFileRoute("/monosilabas")({
  head: () => ({
    meta: [
      { title: "Monosílabas con audio — OCUPAMOR" },
      {
        name: "description",
        content:
          "Practica ma, me, mi, mo, mu y más sílabas simples con voz en español y palabras de ejemplo.",
      },
      { property: "og:title", content: "Monosílabas con audio — OCUPAMOR" },
      {
        property: "og:description",
        content: "Sílabas simples con dibujos y voz para practicar sin prisa.",
      },
    ],
  }),
  component: MonosilabasScreen,
});

function MonosilabasScreen() {
  const user = useSessionUser();

  return (
    <Screen title="Monosílabas" subtitle="Sílabas simples con dibujos">
      <SoftLabel size="sm" muted>
        Toca una sílaba para escucharla. Toca el botón para oír la palabra.
      </SoftLabel>

      <div className="grid grid-cols-2 gap-3">
        {MONOSILABAS.map(([syl, big, palabra], i) => (
          <div
            key={syl}
            className="rise-in flex flex-col items-center gap-1 rounded-3xl bg-card p-3"
            style={{ animationDelay: `${i * 25}ms` }}
          >
            <button
              type="button"
              onClick={() => {
                say(`${syl} como en ${palabra}`);
                trackActivity(user?.email, "silabas", true);
              }}
              className="flex flex-col items-center active:opacity-70"
            >
              <span className="text-3xl font-bold text-primary">{big}</span>
              <span className="text-lg font-bold text-secondary">{syl}</span>
              <span className="text-xs text-muted-foreground">{palabra}</span>
            </button>
            <AudioButton
              text={syl}
              tone="secondary"
              onPlayed={() => trackActivity(user?.email, "silabas", true)}
            />
          </div>
        ))}
      </div>
    </Screen>
  );
}
