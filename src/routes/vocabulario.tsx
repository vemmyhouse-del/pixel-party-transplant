import { createFileRoute } from "@tanstack/react-router";

import {
  AudioButton,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { PALABRAS } from "@/data/content";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";

export const Route = createFileRoute("/vocabulario")({
  head: () => ({
    meta: [
      { title: "Vocabulario básico — OCUPAMOR" },
      {
        name: "description",
        content:
          "Palabras cotidianas con dibujo y voz en español: gato, casa, sol, luna y más, para nombrar el mundo.",
      },
      { property: "og:title", content: "Vocabulario básico — OCUPAMOR" },
      {
        property: "og:description",
        content: "Palabras con dibujos y audio para ampliar el vocabulario.",
      },
    ],
  }),
  component: VocabularioScreen,
});

function VocabularioScreen() {
  const user = useSessionUser();

  return (
    <Screen title="Vocabulario" subtitle="Palabras con dibujos">
      <SoftLabel size="sm" muted>
        Toca la palabra para escucharla y repítela en voz alta.
      </SoftLabel>

      <div className="grid grid-cols-2 gap-3">
        {PALABRAS.map(([emoji, palabra], i) => (
          <div
            key={palabra}
            className="rise-in flex flex-col items-center gap-2 rounded-3xl bg-card p-4"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <button
              type="button"
              onClick={() => {
                say(palabra);
                trackActivity(user?.email, "vocabulario", true);
              }}
              className="flex flex-col items-center gap-1 active:opacity-70"
            >
              <span className="text-5xl">{emoji}</span>
              <span className="text-lg font-bold text-primary">{palabra}</span>
            </button>
            <AudioButton
              text={palabra}
              tone="secondary"
              onPlayed={() => trackActivity(user?.email, "vocabulario", true)}
            />
          </div>
        ))}
      </div>
    </Screen>
  );
}
