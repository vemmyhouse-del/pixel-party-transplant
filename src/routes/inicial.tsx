import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  Card,
  PrimaryButton,
  Screen,
  SoftLabel,
  useSessionUser,
} from "@/components/ocupamor/ui";


export const Route = createFileRoute("/inicial")({
  head: () => ({
    meta: [
      { title: "Etapa Inicial — OCUPAMOR" },
      {
        name: "description",
        content:
          "Abecedario, monosílabas, sílabas y vocabulario con dibujos y audio para los primeros pasos de lectura.",
      },
      { property: "og:title", content: "Etapa Inicial — OCUPAMOR" },
      {
        property: "og:description",
        content: "Letras, sílabas y primeras palabras con voz y dibujos.",
      },
    ],
  }),
  component: InicialHub,
});

function InicialHub() {
  const navigate = useNavigate();
  useSessionUser();

  return (
    <Screen title="Etapa Inicial" subtitle="Elige un área de aprendizaje">
      <SoftLabel bold size="lg">
        ¿Qué quieres aprender hoy?
      </SoftLabel>

      <Card>
        <SoftLabel bold size="lg">
          Abecedario
        </SoftLabel>
        <SoftLabel size="sm" muted className="mb-2">
          Letras del alfabeto con dibujos para identificar
        </SoftLabel>
        <div className="mb-3 flex gap-2">
          {["A", "B", "C", "D"].map((l) => (
            <div
              key={l}
              className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            >
              <span className="text-xl font-bold">{l}</span>
              <span className="text-[11px] opacity-90">{l.toLowerCase()}</span>
            </div>
          ))}
        </div>
        <PrimaryButton tone="secondary" big onClick={() => navigate({ to: "/abecedario" })}>
          Ir al Abecedario
        </PrimaryButton>
      </Card>

      <Card>
        <SoftLabel bold size="lg">
          Monosílabas
        </SoftLabel>
        <SoftLabel size="sm" muted className="mb-2">
          ma, me, mi, mo, mu... con imágenes
        </SoftLabel>
        <div className="mb-3 flex gap-2">
          {["ma", "me", "mi", "mo"].map((s) => (
            <div
              key={s}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-lg font-bold text-secondary-foreground"
            >
              {s}
            </div>
          ))}
        </div>
        <PrimaryButton tone="accent" big onClick={() => navigate({ to: "/monosilabas" })}>
          Ir a Monosílabas
        </PrimaryButton>
      </Card>

      <Card>
        <SoftLabel bold size="lg">
          Sílabas
        </SoftLabel>
        <SoftLabel size="sm" muted className="mb-2">
          Todas las sílabas para practicar
        </SoftLabel>
        <div className="mb-3 flex gap-3">
          {["sa", "se", "si", "so", "su"].map((s) => (
            <span key={s} className="text-lg font-bold text-primary">
              {s}
            </span>
          ))}
        </div>
        <PrimaryButton big onClick={() => navigate({ to: "/silabas" })}>
          Ir a Sílabas
        </PrimaryButton>
      </Card>

      <Card>
        <SoftLabel bold size="lg">
          Vocabulario
        </SoftLabel>
        <SoftLabel size="sm" muted className="mb-2">
          Palabras con dibujos para identificar
        </SoftLabel>
        <div className="mb-3 flex gap-2">
          {[
            ["🐱", "gato"],
            ["🏠", "casa"],
            ["☀️", "sol"],
            ["🌙", "luna"],
          ].map(([e, p]) => (
            <div
              key={p}
              className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-accent text-accent-foreground"
            >
              <span className="text-lg">{e}</span>
              <span className="text-[10px] font-bold">{p}</span>
            </div>
          ))}
        </div>
        <PrimaryButton tone="calm" big onClick={() => navigate({ to: "/vocabulario" })}>
          Ir a Vocabulario
        </PrimaryButton>
      </Card>
    </Screen>
  );
}

