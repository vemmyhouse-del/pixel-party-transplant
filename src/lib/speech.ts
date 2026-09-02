/**
 * Voz (TTS) portado de speech.py.
 * En navegador y en Android (WebView + Capacitor) usa la síntesis de voz del
 * sistema en español, con ritmo lento y calmado como en la versión Python.
 */

let lastText = "";
let lastTime = 0;

function pickSpanishVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /^es[-_]/i.test(v.lang) && /es[-_](ES|419|MX)/i.test(v.lang)) ??
    voices.find((v) => /^es/i.test(v.lang)) ??
    null
  );
}

/** Dice el texto en voz alta (ignora repeticiones inmediatas). */
export function say(text: string): void {
  if (typeof window === "undefined") return;
  const clean = (text ?? "").toString().trim();
  if (!clean) return;

  const now = Date.now();
  if (clean === lastText && now - lastTime < 350) return;
  lastText = clean;
  lastTime = now;

  const synth = window.speechSynthesis;
  if (!synth) return;

  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "es-ES";
    u.rate = 0.82;
    u.pitch = 1;
    u.volume = 1;
    const voice = pickSpanishVoice(synth);
    if (voice) u.voice = voice;
    synth.speak(u);
  } catch (e) {
    console.warn("[TTS] no disponible:", e);
  }
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") return;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* noop */
  }
}

/** Precarga la lista de voces (Chrome/Android la carga de forma asíncrona). */
export function warmUpVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
