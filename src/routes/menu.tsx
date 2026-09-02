import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { PrimaryButton, SoftLabel, useSessionUser } from "@/components/ocupamor/ui";
import { logout } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menú de actividades — OCUPAMOR" },
      {
        name: "description",
        content:
          "Elige una actividad: etapa inicial, abecedario, matemáticas, calma sensorial, señas, emociones, misiones y progreso.",
      },
      { property: "og:title", content: "Menú de actividades — OCUPAMOR" },
      {
        property: "og:description",
        content: "Todas las actividades de OCUPAMOR en un solo lugar.",
      },
    ],
  }),
  component: MenuScreen,
});

type Item = {
  titulo: string;
  desc: string;
  to: string;
  tone: string;
  icon: string;
};

const ITEMS: Item[] = [
  {
    titulo: "Etapa Inicial",
    desc: "Letras, colores y primeras palabras",
    to: "/inicial",
    tone: "bg-secondary text-secondary-foreground",
    icon: "01_etapa_inicial.png",
  },
  {
    titulo: "Abecedario",
    desc: "De la A a la Z con dibujos",
    to: "/abecedario",
    tone: "bg-primary text-primary-foreground",
    icon: "02_abecedario.png",
  },
  {
    titulo: "Matemáticas",
    desc: "Números, sumas y figuras",
    to: "/matematicas",
    tone: "bg-primary-dark text-primary-foreground",
    icon: "03_matematicas.png",
  },
  {
    titulo: "Etapa Avanzada",
    desc: "Lectura y ejercicios más largos",
    to: "/avanzada",
    tone: "bg-accent text-accent-foreground",
    icon: "04_etapa_avanzada.png",
  },
  {
    titulo: "Calma Sensorial",
    desc: "Respirar y bajar revoluciones",
    to: "/calma",
    tone: "bg-calm text-calm-foreground",
    icon: "05_calma_sensorial.png",
  },
  {
    titulo: "Señas y Comunicación",
    desc: "Aprender a pedir y responder",
    to: "/senas",
    tone: "bg-primary text-primary-foreground",
    icon: "06_senas_comunicacion.png",
  },
  {
    titulo: "Emociones",
    desc: "Reconocer cómo me siento",
    to: "/emociones",
    tone: "bg-secondary text-secondary-foreground",
    icon: "07_emociones.png",
  },
  {
    titulo: "Misiones",
    desc: "Retos cortos del día",
    to: "/misiones",
    tone: "bg-accent text-accent-foreground",
    icon: "08_misiones.png",
  },
  {
    titulo: "Mi Progreso",
    desc: "Lo que ya lograste",
    to: "/progreso",
    tone: "bg-primary text-primary-foreground",
    icon: "09_mi_progreso.png",
  },
  {
    titulo: "Configuración",
    desc: "Ajustes de la aplicación",
    to: "/configuracion",
    tone: "bg-calm text-calm-foreground",
    icon: "10_configuracion.png",
  },
];

const PANEL: Item = {
  titulo: "Panel del Adulto",
  desc: "Seguimiento y reportes",
  to: "/panel",
  tone: "bg-primary-dark text-primary-foreground",
  icon: "11_panel_adulto.png",
};

function MenuScreen() {
  const navigate = useNavigate();
  const user = useSessionUser();
  const items = user ? [...ITEMS, PANEL] : ITEMS;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="rise-in rounded-b-3xl bg-primary px-5 pt-6 pb-5 text-primary-foreground">
        <h1 className="text-xl font-bold">OCUPAMOR</h1>
        <p className="text-xs opacity-90">
          Bienvenido, {user?.name ?? "amig@"}
        </p>
      </header>

      <main className="flex-1 space-y-4 px-4 pt-4 pb-8">
        <SoftLabel bold size="lg">
          Elige una actividad
        </SoftLabel>

        <div className="grid grid-cols-2 gap-3">
          {items.map((it, i) => (
            <button
              key={it.to}
              type="button"
              onClick={() => navigate({ to: it.to })}
              className={cn(
                "rise-in flex flex-col items-center gap-1 rounded-3xl p-3 text-center transition active:scale-[0.98] active:opacity-80",
                it.tone,
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <img
                src={`/assets/images/menu/${it.icon}`}
                alt={it.titulo}
                loading="lazy"
                className="h-20 w-20 object-contain"
              />
              <span className="text-sm font-bold">{it.titulo}</span>
              <span className="text-[11px] leading-tight opacity-85">
                {it.desc}
              </span>
            </button>
          ))}
        </div>

        <PrimaryButton
          tone="card"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          Cerrar sesión
        </PrimaryButton>
      </main>
    </div>
  );
}
