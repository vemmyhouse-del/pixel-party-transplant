/** Actividades reutilizables: opción múltiple, comprensión lectora y
 *  "ordena la oración" (portadas de AvanzadaScreen / MissionPlayScreen). */
import { useMemo, useState } from "react";

import { AudioButton, Card, PrimaryButton, SoftLabel, showToast } from "./ui";
import { ORACIONES, randomOf, shuffle, type Quiz } from "@/data/content";
import { say } from "@/lib/speech";

export function ChoiceCard({
  prompt,
  options,
  correct,
  onAnswer,
  texto,
}: {
  prompt: string;
  options: string[];
  correct: number;
  onAnswer: (ok: boolean) => void;
  texto?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <Card>
      {texto && (
        <SoftLabel size="sm" className="mb-2">
          {texto}
        </SoftLabel>
      )}
      <div className="mb-2 flex items-start justify-between gap-2">
        <SoftLabel bold>{prompt}</SoftLabel>
        <AudioButton text={texto ? `${texto} ${prompt}` : prompt} label="Oír" tone="calm" />
      </div>
      <div className="space-y-2">
        {options.map((o, i) => (
          <button
            key={o + i}
            type="button"
            onClick={() => {
              setPicked(i);
              const ok = i === correct;
              showToast(ok ? "¡Correcto!" : "Sigue intentando");
              say(ok ? "Correcto" : "Sigue intentando");
              onAnswer(ok);
            }}
            className={[
              "min-h-12 w-full rounded-2xl px-4 font-bold transition active:opacity-80",
              picked === i && i === correct
                ? "bg-soft-2 text-foreground"
                : picked === i
                  ? "bg-soft-3 text-foreground"
                  : "bg-accent text-accent-foreground",
            ].join(" ")}
          >
            {o}
          </button>
        ))}
      </div>
    </Card>
  );
}

export function QuizCard({
  quiz,
  onAnswer,
}: {
  quiz: Quiz;
  onAnswer: (ok: boolean) => void;
}) {
  return (
    <ChoiceCard
      texto={quiz.texto}
      prompt={quiz.pregunta}
      options={quiz.opciones}
      correct={quiz.correcta}
      onAnswer={onAnswer}
    />
  );
}

export function OrderingCard({ onAnswer }: { onAnswer: (ok: boolean) => void }) {
  const [target, setTarget] = useState<string[]>(() => randomOf(ORACIONES));
  const pool = useMemo(() => shuffle(target), [target]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [used, setUsed] = useState<number[]>([]);

  function reset(newSentence = false) {
    setChosen([]);
    setUsed([]);
    if (newSentence) setTarget(randomOf(ORACIONES));
  }

  function pick(word: string, idx: number) {
    if (used.includes(idx)) return;
    const next = [...chosen, word];
    setChosen(next);
    setUsed([...used, idx]);
    if (next.length === target.length) {
      if (next.join(" ") === target.join(" ")) {
        showToast("¡Muy bien! Frase correcta.");
        say(target.join(" "));
        onAnswer(true);
        setTimeout(() => reset(true), 1600);
      } else {
        showToast("Casi, inténtalo de nuevo.");
        onAnswer(false);
        setTimeout(() => reset(false), 1500);
      }
    }
  }

  return (
    <Card>
      <SoftLabel bold size="lg" className="mb-2">
        {chosen.length ? chosen.join(" ") : "_____"}
      </SoftLabel>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {pool.map((w, i) => (
          <button
            key={w + i}
            type="button"
            disabled={used.includes(i)}
            onClick={() => pick(w, i)}
            className="min-h-11 rounded-2xl bg-accent px-2 font-bold text-accent-foreground transition active:opacity-80 disabled:opacity-30"
          >
            {w}
          </button>
        ))}
      </div>
      <PrimaryButton tone="secondary" onClick={() => reset(false)}>
        Reiniciar
      </PrimaryButton>
    </Card>
  );
}
