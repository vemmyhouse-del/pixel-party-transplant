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
import { say } from "@/lib/speech";
import { addMission, getMissions, saveMissions, type Mission } from "@/lib/store";

export const Route = createFileRoute("/misiones")({
  head: () => ({
    meta: [
      { title: "Misiones y retos del día — OCUPAMOR" },
      {
        name: "description",
        content:
          "Crea retos cortos por categoría y observa cómo avanzan solos mientras el niño practica en la aplicación.",
      },
      { property: "og:title", content: "Misiones y retos del día — OCUPAMOR" },
      {
        property: "og:description",
        content: "Retos cortos que se completan practicando cada actividad.",
      },
    ],
  }),
  component: MisionesScreen,
});

function MisionesScreen() {
  const user = useSessionUser();
  const [misiones, setMisiones] = useState<Mission[]>([]);
  const tituloField = useField("");
  const metaField = useField("5");
  const catField = useSelectField(LEARNING_CATEGORIES[0]![0]);

  useEffect(() => {
    if (user) setMisiones(getMissions(user.email));
  }, [user]);

  function crear() {
    if (!user) return;
    const titulo = tituloField.get().trim();
    if (titulo.length < 3) {
      showToast("Escribe un título para la misión");
      return;
    }
    const meta = Math.max(1, Number(metaField.get()) || 1);
    addMission(user.email, titulo, meta, catField.get());
    setMisiones(getMissions(user.email));
    tituloField.set("");
    showToast("Misión creada");
    say("Misión creada");
  }

  function borrar(id: number) {
    if (!user) return;
    const next = misiones.filter((m) => m.id !== id);
    saveMissions(user.email, next);
    setMisiones(next);
  }

  return (
    <Screen title="Misiones" subtitle="Retos cortos del día">
      <Card className="space-y-3">
        <SoftLabel bold size="lg">
          Nueva misión
        </SoftLabel>
        <TextField field={tituloField} placeholder="Ej. Practicar 5 sílabas" />
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <SelectField field={catField}>
              {LEARNING_CATEGORIES.map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </SelectField>
          </div>
          <TextField
            field={metaField}
            type="number"
            inputMode="numeric"
            min={1}
            className="w-24 shrink-0 text-center"
          />
        </div>
        <PrimaryButton big onClick={crear}>
          Crear misión
        </PrimaryButton>
      </Card>

      <SoftLabel bold size="lg">
        Tus misiones
      </SoftLabel>

      {misiones.length === 0 && (
        <Card tone="soft">
          <SoftLabel size="sm" muted>
            Todavía no hay misiones. Crea la primera arriba.
          </SoftLabel>
        </Card>
      )}

      {misiones.map((m) => {
        const pct = Math.round((m.progress / m.target) * 100);
        return (
          <Card key={m.id} className="space-y-2" border>
            <div className="flex items-start justify-between gap-2">
              <SoftLabel bold>{m.title}</SoftLabel>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${m.done ? "bg-soft-2" : "bg-soft"}`}
              >
                {m.done ? "Completada" : `${m.progress}/${m.target}`}
              </span>
            </div>
            <Bar pct={pct} tone={m.done ? "bg-secondary" : "bg-primary"} />
            <SoftLabel size="xs" muted>
              Categoría:{" "}
              {LEARNING_CATEGORIES.find(([k]) => k === m.category)?.[1] ??
                m.category}
            </SoftLabel>
            <PrimaryButton tone="soft" onClick={() => borrar(m.id)}>
              Eliminar
            </PrimaryButton>
          </Card>
        );
      })}
    </Screen>
  );
}
