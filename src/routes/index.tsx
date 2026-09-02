import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { PrimaryButton, SoftLabel, showToast } from "@/components/ocupamor/ui";
import { login, register, type Role } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OCUPAMOR — Entrar o crear tu cuenta" },
      {
        name: "description",
        content:
          "Entra a OCUPAMOR: actividades de lenguaje, matemáticas, señas y calma sensorial para niños. Funciona sin internet.",
      },
      { property: "og:title", content: "OCUPAMOR — Aprendiendo con calma" },
      {
        property: "og:description",
        content:
          "Software educativo de soporte lingüístico y fonético con disminución sensorial.",
      },
    ],
  }),
  component: LoginScreen,
});

const ROLES: Role[] = ["representante", "docente", "terapeuta", "tutor"];

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("representante");

  function doLogin() {
    const res = login(email, pwd);
    showToast(res.msg);
    if (res.ok) navigate({ to: "/menu" });
  }

  function doRegister() {
    const res = register(email, pwd, name, role);
    showToast(res.msg);
  }

  const inputClass =
    "min-h-13 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="rise-in rounded-b-[2.25rem] bg-primary px-6 pt-10 pb-7 text-primary-foreground">
        <p className="text-3xl font-bold tracking-tight">OCUPAMOR</p>
        <p className="mt-1 text-sm opacity-90">Aprendiendo con calma</p>
      </header>

      <main className="flex-1 space-y-4 px-5 py-6">
        <div className="rise-in space-y-3 rounded-3xl bg-card p-5">
          <SoftLabel bold size="lg">
            Entra o crea tu cuenta
          </SoftLabel>
          <SoftLabel size="xs" muted>
            El nombre y el rol solo se necesitan al registrarte.
          </SoftLabel>

          <div className="space-y-1">
            <SoftLabel bold size="sm">
              Correo
            </SoftLabel>
            <input
              className={inputClass}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <SoftLabel bold size="sm">
              Contraseña
            </SoftLabel>
            <input
              className={inputClass}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <SoftLabel bold size="sm">
              Nombre
            </SoftLabel>
            <input
              className={inputClass}
              placeholder="¿Cómo te llamas?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <SoftLabel bold size="sm">
              Rol
            </SoftLabel>
            <select
              className={`${inputClass} bg-soft`}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-1">
            <PrimaryButton big onClick={doLogin}>
              Iniciar sesión
            </PrimaryButton>
            <PrimaryButton tone="secondary" onClick={doRegister}>
              Crear cuenta nueva
            </PrimaryButton>
          </div>
        </div>

        <div className="rise-in rounded-2xl bg-soft px-4 py-3 text-center">
          <SoftLabel size="xs" muted>
            Modo local (funciona sin internet)
          </SoftLabel>
        </div>
      </main>
    </div>
  );
}
