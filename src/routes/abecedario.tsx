import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  PrimaryButton,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";
import { ABC_SETS, getAbcSet, type AbcItem } from "@/data/abecedario";
import { say } from "@/lib/speech";
import { trackActivity } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/abecedario")({
  head: () => ({
    meta: [
      { title: "Abecedario ilustrado — OCUPAMOR" },
      {
        name: "description",
        content:
          "De la A a la Z con dibujos de frutas, vegetales y animales, con voz para cada letra y palabra.",
      },
      { property: "og:title", content: "Abecedario ilustrado — OCUPAMOR" },
      {
        property: "og:description",
        content: "Aprende las letras con dibujos reales y audio en español.",
      },
    ],
  }),
  component: AbecedarioScreen,
});

const TINTS = ["bg-soft", "bg-soft-2", "bg-soft-3"];

function AbecedarioScreen() {
  const user = useSessionUser();
  const [setKey, setSetKey] = useState("comida");
  const [detail, setDetail] = useState<AbcItem | null>(null);
  const data = getAbcSet(setKey);

  function open(item: AbcItem) {
    say(`${item.letra}, de ${item.palabra}`);
    trackActivity(user?.email, "vocales", true);
    setDetail(item);
  }

  return (
    <Screen title="Abecedario" subtitle="De la A a la Z con dibujos">
      <SoftLabel size="sm" muted>
        Toca una tarjeta para escuchar la letra y su palabra.
      </SoftLabel>

      <div className="flex gap-2">
        {ABC_SETS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSetKey(s.key)}
            className={cn(
              "min-h-11 flex-1 rounded-full px-3 text-sm font-bold transition active:opacity-80",
              s.key === setKey
                ? "bg-primary text-primary-foreground"
                : "bg-soft text-foreground",
            )}
          >
            {s.titulo}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.items.map((it, i) => (
          <button
            key={it.letra + it.palabra}
            type="button"
            onClick={() => open(it)}
            className={cn(
              "rise-in flex flex-col items-center gap-1 rounded-3xl border border-border p-2 transition active:scale-[0.98] active:opacity-80",
              TINTS[i % 3],
            )}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <img
              src={`/assets/images/abecedario/${it.img}`}
              alt={`${it.letra} de ${it.palabra}`}
              loading="lazy"
              className="h-36 w-full rounded-2xl object-contain"
            />
            <span className="text-2xl font-bold text-primary">{it.letra}</span>
            <span className="text-sm text-muted-foreground">{it.palabra}</span>
          </button>
        ))}
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-5"
          onClick={() => setDetail(null)}
        >
          <div
            className="rise-in w-full max-w-sm space-y-3 rounded-3xl bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/assets/images/abecedario/${detail.img}`}
              alt={`${detail.letra} de ${detail.palabra}`}
              className="h-56 w-full rounded-2xl object-contain"
            />
            <p className="text-center text-4xl font-bold text-primary">
              {detail.letra} {detail.letra.toLowerCase()}
            </p>
            <p className="text-center text-xl font-bold">{detail.palabra}</p>
            <div className="flex gap-2">
              <PrimaryButton tone="secondary" onClick={() => say(detail.letra)}>
                Oír la letra
              </PrimaryButton>
              <PrimaryButton tone="calm" onClick={() => say(detail.palabra)}>
                Oír la palabra
              </PrimaryButton>
            </div>
            <PrimaryButton onClick={() => setDetail(null)}>Cerrar</PrimaryButton>
          </div>
        </div>
      )}
    </Screen>
  );
}
