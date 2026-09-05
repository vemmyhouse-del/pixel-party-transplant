/** Piezas de interfaz portadas de los widgets Kivy (RoundedBox, RoundedButton,
 *  AudioButton, SoftLabel, cabecera con botón volver, "toast" y barra de progreso). */
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { say } from "@/lib/speech";
import { currentUser, type User } from "@/lib/store";

export type Tone =
  | "primary"
  | "primaryDark"
  | "secondary"
  | "accent"
  | "calm"
  | "card"
  | "soft";

const toneBg: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  primaryDark: "bg-primary-dark text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  calm: "bg-calm text-calm-foreground",
  card: "bg-card text-card-foreground",
  soft: "bg-soft text-foreground",
};

export function Card({
  children,
  tone = "card",
  className,
  onClick,
  border = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  onClick?: () => void;
  border?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rise-in w-full rounded-3xl p-4 text-left transition-transform duration-150",
        toneBg[tone],
        border && "border border-border",
        onClick && "active:scale-[0.985] active:opacity-80",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function PrimaryButton({
  children,
  onClick,
  tone = "primary",
  big = false,
  disabled = false,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  big?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-3xl font-bold transition active:opacity-80 disabled:opacity-40",
        toneBg[tone],
        big ? "min-h-14 px-5 text-lg" : "min-h-12 px-4 text-base",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Botón "Escuchar" con la imagen de corneta del proyecto original. */
export function AudioButton({
  text,
  label = "Escuchar",
  tone = "primary",
  onPlayed,
  className,
}: {
  text: string;
  label?: string;
  tone?: Tone;
  onPlayed?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        say(text);
        onPlayed?.();
      }}
      className={cn(
        "inline-flex min-h-13 items-center gap-2 rounded-full px-4 py-3 font-bold transition active:opacity-80",
        toneBg[tone],
        className,
      )}
    >
      <img
        src="/assets/images/corneta.png"
        alt=""
        aria-hidden
        className="h-6 w-6 object-contain"
      />
      <span className="text-sm">{label}</span>
    </button>
  );
}

export function SoftLabel({
  children,
  bold = false,
  size = "base",
  muted = false,
  className,
}: {
  children: ReactNode;
  bold?: boolean;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  muted?: boolean;
  className?: string;
}) {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  } as const;
  return (
    <p
      className={cn(
        sizes[size],
        bold && "font-bold",
        muted ? "text-muted-foreground" : "text-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Bar({
  pct,
  tone = "bg-primary",
  height = "h-3.5",
}: {
  pct: number;
  tone?: string;
  height?: string;
}) {
  const value = Math.max(0, Math.min(100, pct));
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-border", height)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", tone)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function showToast(msg: string) {
  toast(msg, { duration: 1800 });
}

/** Pantalla con cabecera curva, título, subtítulo y botón volver. */
export function Screen({
  title,
  subtitle,
  children,
  backTo = "/menu",
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backTo?: string;
  showBack?: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="rise-in flex items-center gap-3 rounded-b-3xl bg-primary px-4 pt-5 pb-5 text-primary-foreground">
        {showBack && (
          <Link
            to={backTo}
            aria-label="Volver"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-dark active:opacity-80"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">{title}</h1>
          {subtitle && <p className="truncate text-xs opacity-90">{subtitle}</p>}
        </div>
      </header>
      <main className="flex-1 space-y-3 px-4 pt-3 pb-8">{children}</main>
    </div>
  );
}

/** Usuario de la sesión; redirige al login si no hay sesión abierta. */
export function useSessionUser(): User | null {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      navigate({ to: "/" });
      return;
    }
    setUser(u);
  }, [navigate]);

  return user;
}
