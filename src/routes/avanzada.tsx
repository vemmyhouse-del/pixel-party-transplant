import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ChoiceCard, OrderingCard, QuizCard } from "@/components/ocupamor/actividades";
import {
  AudioButton,
  Card,
  PrimaryButton,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import {
  ANTONIMOS,
  COMPRENSION,
  RETOS_COGNITIVOS,
  SINONIMOS,
  TRABALENGUAS,
  randomOf,
} from "@/data/content";
import { trackActivity } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/avanzada")({
  head: () => ({
    meta: [
      { title: "Etapa Avanzada — OCUPAMOR" },
      {
        name: "description",
        content:
          "Comprensión lectora, trabalenguas, sinónimos, antónimos, ordenar oraciones y retos cognitivos con voz.",
      },
      { property: "og:title", content: "Etapa Avanzada — OCUPAMOR" },
      {
        property: "og:description",
        content: "Lectura y ejercicios más largos para seguir avanzando.",
      },
    ],
  }),
  component: AvanzadaScreen,
});

type Tab =
  | "comprension"
  | "trabalenguas"
  | "sinonimos"
  | "antonimos"
  | "oraciones"
  | "cognitivo";

const TABS: Array<[Tab, string]> = [
  ["comprension", "Comprensión"],
  ["trabalenguas", "Trabalenguas"],
  ["sinonimos", "Sinónimos"],
  ["antonimos", "Antónimos"],
  ["oraciones", "Oraciones"],
  ["cognitivo", "Retos"],
];

function AvanzadaScreen() {
  const user = useSessionUser();
  const [tab, setTab] = useState<Tab>("comprension");
  const [quiz, setQuiz] = useState(() => randomOf(COMPRENSION));
  const [tl, setTl] = useState(() => randomOf(TRABALENGUAS));
  const [sin, setSin] = useState(() => randomOf(SINONIMOS));
  const [ant, setAnt] = useState(() => randomOf(ANTONIMOS));
  const [reto, setReto] = useState(() => randomOf(RETOS_COGNITIVOS));

  const track = (cat: string) => (ok: boolean) => trackActivity(user?.email, cat, ok);

  return (
    <Screen title="Etapa Avanzada" subtitle="Lectura y ejercicios más largos">
      <div className="flex flex-wrap gap-2">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm font-bold transition active:opacity-80",
              tab === k
                ? "bg-primary text-primary-foreground"
                : "bg-soft text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "comprension" && (
        <>
          <QuizCard quiz={quiz} onAnswer={track("comprension")} />
          <PrimaryButton
            tone="secondary"
            onClick={() => setQuiz(randomOf(COMPRENSION))}
          >
            Otro texto
          </PrimaryButton>
        </>
      )}

      {tab === "trabalenguas" && (
        <>
          <Card className="space-y-3">
            <SoftLabel bold size="lg">
              Repite despacio
            </SoftLabel>
            <SoftLabel size="lg">{tl}</SoftLabel>
            <AudioButton
              text={tl}
              label="Escuchar"
              tone="calm"
              onPlayed={() => trackActivity(user?.email, "trabalenguas", true)}
            />
          </Card>
          <PrimaryButton
            tone="secondary"
            onClick={() => setTl(randomOf(TRABALENGUAS))}
          >
            Otro trabalenguas
          </PrimaryButton>
        </>
      )}

      {tab === "sinonimos" && (
        <>
          <ChoiceCard
            prompt={`¿Qué palabra significa lo mismo que "${sin[0]}"?`}
            options={sin[1]}
            correct={sin[2]}
            onAnswer={track("sinonimos")}
          />
          <PrimaryButton tone="secondary" onClick={() => setSin(randomOf(SINONIMOS))}>
            Otra palabra
          </PrimaryButton>
        </>
      )}

      {tab === "antonimos" && (
        <>
          <ChoiceCard
            prompt={`¿Qué palabra significa lo contrario de "${ant[0]}"?`}
            options={ant[1]}
            correct={ant[2]}
            onAnswer={track("sinonimos")}
          />
          <PrimaryButton tone="secondary" onClick={() => setAnt(randomOf(ANTONIMOS))}>
            Otra palabra
          </PrimaryButton>
        </>
      )}

      {tab === "oraciones" && (
        <>
          <SoftLabel size="sm" muted>
            Toca las palabras en el orden correcto para armar la oración.
          </SoftLabel>
          <OrderingCard onAnswer={track("oraciones")} />
        </>
      )}

      {tab === "cognitivo" && (
        <>
          <ChoiceCard
            prompt={reto.pregunta}
            options={reto.opciones}
            correct={reto.correcta}
            onAnswer={track("cognitivo")}
          />
          <PrimaryButton
            tone="secondary"
            onClick={() => setReto(randomOf(RETOS_COGNITIVOS))}
          >
            Otro reto
          </PrimaryButton>
        </>
      )}
    </Screen>
  );
}
