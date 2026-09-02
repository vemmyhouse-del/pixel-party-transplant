/**
 * Almacenamiento local portado de auth.py + data_store.py.
 * Todo se guarda en el dispositivo (localStorage), igual que la versión
 * Python guardaba archivos JSON en ~/.ocupamor. Funciona sin internet.
 */
import { LEARNING_CATEGORIES } from "@/data/content";

const K_USERS = "ocupamor.users";
const K_SESSION = "ocupamor.session_user";
const K_PROGRESS = "ocupamor.progress";
const K_SETTINGS = "ocupamor.settings";
const K_MISSIONS = "ocupamor.missions";
const K_RUN = "ocupamor.run_session";

export type Role = "representante" | "docente" | "terapeuta" | "tutor";
export type User = { email: string; name: string; role: Role };

type StoredUser = { password: string; name: string; role: Role };

export type Settings = {
  categories: Record<string, boolean>;
  session_size: number;
};

export type Mission = {
  id: number;
  title: string;
  target: number;
  category: string;
  progress: number;
  done: boolean;
  created: string;
};

export type SessionRow = {
  date: string;
  total: number;
  correct: number;
  sensory_used: boolean;
};

export type Progress = {
  points: number;
  sessions: SessionRow[];
  sensory_uses: number;
  totals: Record<string, { ok: number; fail: number }>;
};

/* ------------------------------ utilidades ------------------------------ */

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[store] no se pudo guardar", key, e);
  }
}

/** Hash simple y estable (equivalente al sha256 local del proyecto Python). */
function hash(text: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = (h1 ^ c) * 0x01000193;
    h2 = (h2 + c * (i + 7)) ^ (h2 << 5);
    h1 >>>= 0;
    h2 >>>= 0;
  }
  return `${h1.toString(16)}${h2.toString(16)}`;
}

function nowIso(): string {
  return new Date().toISOString().slice(0, 19);
}

/* ------------------------------ autenticación ------------------------------ */

export function register(
  email: string,
  password: string,
  name = "",
  role: Role = "representante",
): { ok: boolean; msg: string } {
  const mail = email.trim().toLowerCase();
  if (!mail || !password) return { ok: false, msg: "Ingresa correo y contraseña." };
  if (password.length < 6)
    return { ok: false, msg: "La contraseña debe tener al menos 6 caracteres." };
  const users = read<Record<string, StoredUser>>(K_USERS, {});
  if (users[mail]) return { ok: false, msg: "Correo ya registrado." };
  users[mail] = { password: hash(password), name, role };
  write(K_USERS, users);
  return { ok: true, msg: "Cuenta creada." };
}

export function login(
  email: string,
  password: string,
): { ok: boolean; msg: string; user: User | null } {
  const mail = email.trim().toLowerCase();
  if (!mail || !password)
    return { ok: false, msg: "Ingresa correo y contraseña.", user: null };
  const users = read<Record<string, StoredUser>>(K_USERS, {});
  const u = users[mail];
  if (u && u.password === hash(password)) {
    const user: User = {
      email: mail,
      name: u.name || mail.split("@")[0] || mail,
      role: u.role || "representante",
    };
    write(K_SESSION, user);
    return { ok: true, msg: "Bienvenido.", user };
  }
  return { ok: false, msg: "Credenciales incorrectas.", user: null };
}

export function currentUser(): User | null {
  return read<User | null>(K_SESSION, null);
}

export function logout(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(K_SESSION);
}

/* --------------------- Configuración de aprendizaje (M5) --------------------- */

export function getSettings(email: string): Settings {
  const all = read<Record<string, Settings>>(K_SETTINGS, {});
  if (!all[email]) {
    all[email] = {
      categories: Object.fromEntries(LEARNING_CATEGORIES.map(([k]) => [k, true])),
      session_size: 10,
    };
    write(K_SETTINGS, all);
  }
  return all[email];
}

export function saveSettings(email: string, settings: Settings): void {
  const all = read<Record<string, Settings>>(K_SETTINGS, {});
  all[email] = settings;
  write(K_SETTINGS, all);
}

export function categoryEnabled(email: string | undefined, key: string): boolean {
  if (!email) return true;
  return getSettings(email).categories[key] ?? true;
}

/* ----------------------------- Misiones (Quest) ----------------------------- */

export function getMissions(email: string): Mission[] {
  const all = read<Record<string, Mission[]>>(K_MISSIONS, {});
  return all[email] ?? [];
}

export function saveMissions(email: string, missions: Mission[]): void {
  const all = read<Record<string, Mission[]>>(K_MISSIONS, {});
  all[email] = missions;
  write(K_MISSIONS, all);
}

export function addMission(
  email: string,
  title: string,
  target: number,
  category: string,
): void {
  const m = getMissions(email);
  m.push({
    id: m.length + 1,
    title,
    target: Math.max(1, Math.trunc(target)),
    category,
    progress: 0,
    done: false,
    created: nowIso(),
  });
  saveMissions(email, m);
}

export function bumpMission(email: string, category: string, amount = 1): void {
  const m = getMissions(email);
  let changed = false;
  for (const x of m) {
    if (!x.done && x.category === category) {
      x.progress = Math.min(x.target, x.progress + amount);
      if (x.progress >= x.target) x.done = true;
      changed = true;
    }
  }
  if (changed) saveMissions(email, m);
}

/* ------------------------- Progreso y sesiones (M6) ------------------------- */

function emptyProgress(): Progress {
  return {
    points: 0,
    sessions: [],
    sensory_uses: 0,
    totals: Object.fromEntries(
      LEARNING_CATEGORIES.map(([k]) => [k, { ok: 0, fail: 0 }]),
    ),
  };
}

export function getProgress(email: string): Progress {
  const all = read<Record<string, Progress>>(K_PROGRESS, {});
  return all[email] ?? emptyProgress();
}

export function saveProgress(email: string, data: Progress): void {
  const all = read<Record<string, Progress>>(K_PROGRESS, {});
  all[email] = data;
  write(K_PROGRESS, all);
}

export function recordActivity(
  email: string | undefined,
  category: string,
  correct: boolean,
): void {
  if (!email) return;
  const p = getProgress(email);
  if (!p.totals[category]) p.totals[category] = { ok: 0, fail: 0 };
  if (correct) {
    p.totals[category].ok += 1;
    p.points += 5;
    bumpMission(email, category, 1);
  } else {
    p.totals[category].fail += 1;
  }
  saveProgress(email, p);
}

export function recordSession(
  email: string,
  total: number,
  correct: number,
  sensoryUsed = false,
): void {
  const p = getProgress(email);
  p.sessions.push({ date: nowIso(), total, correct, sensory_used: sensoryUsed });
  if (sensoryUsed) p.sensory_uses += 1;
  saveProgress(email, p);
}

export function recommendNext(email: string): string[] {
  const p = getProgress(email);
  const ranking = LEARNING_CATEGORIES.map(([k, label]) => {
    const t = p.totals[k] ?? { ok: 0, fail: 0 };
    const total = t.ok + t.fail;
    const score = total === 0 ? 0.5 : t.fail / total;
    return { score, label };
  });
  ranking.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return ranking.slice(0, 3).map((r) => r.label);
}

export function buildReport(email: string): string {
  const p = getProgress(email);
  const lines = [
    `Reporte OCUPAMOR — ${email}`,
    `Generado: ${nowIso()}`,
    `Puntos totales: ${p.points}`,
    `Usos de regulación sensorial: ${p.sensory_uses}`,
    "",
    "Desempeño por categoría:",
  ];
  for (const [k, label] of LEARNING_CATEGORIES) {
    const t = p.totals[k] ?? { ok: 0, fail: 0 };
    lines.push(`  - ${label}: ${t.ok} correctas / ${t.fail} a reforzar`);
  }
  lines.push("", "Últimas sesiones:");
  for (const s of p.sessions.slice(-10)) {
    const pct = s.total ? Math.trunc((s.correct / s.total) * 100) : 0;
    lines.push(
      `  ${s.date}  ${s.correct}/${s.total} (${pct}%)${s.sensory_used ? "  [sensorial]" : ""}`,
    );
  }
  lines.push("", "Recomendado para próxima sesión:");
  for (const r of recommendNext(email)) lines.push(`  • ${r}`);
  return lines.join("\n");
}

/* ------------------------ Sesión de juego en curso ------------------------ */

export type RunSession = { total: number; correct: number; sensoryUsed: boolean };

export function getRun(): RunSession {
  return read<RunSession>(K_RUN, { total: 0, correct: 0, sensoryUsed: false });
}

export function bumpRun(correct: boolean): void {
  const r = getRun();
  r.total += 1;
  if (correct) r.correct += 1;
  write(K_RUN, r);
}

export function markSensoryUsed(): void {
  const r = getRun();
  r.sensoryUsed = true;
  write(K_RUN, r);
}

export function resetRun(): void {
  write(K_RUN, { total: 0, correct: 0, sensoryUsed: false });
}

/** Registra una actividad: progreso general + sesión en curso. */
export function trackActivity(
  email: string | undefined,
  category: string,
  correct = true,
): void {
  recordActivity(email, category, correct);
  bumpRun(correct);
}

/* --------------------------- Misión activa (Quest) --------------------------- */

const K_ACTIVE = "ocupamor.active_mission";

export function setActiveMissionId(id: number): void {
  write(K_ACTIVE, id);
}

export function getActiveMission(email: string): Mission | null {
  const id = read<number | null>(K_ACTIVE, null);
  if (id == null) return null;
  return getMissions(email).find((m) => m.id === id) ?? null;
}
