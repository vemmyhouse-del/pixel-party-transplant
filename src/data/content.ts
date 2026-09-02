/** Contenido educativo portado de content.py (OCUPAMOR Python/Kivy). */

export const VOCALES = ["A", "E", "I", "O", "U"];
export const CONSONANTES_BASICAS = "MPSLNTDBFRC".split("");

export const SILABAS = [
  "ma", "me", "mi", "mo", "mu",
  "pa", "pe", "pi", "po", "pu",
  "sa", "se", "si", "so", "su",
  "la", "le", "li", "lo", "lu",
];

export const PALABRAS: Array<[string, string]> = [
  ["🐱", "gato"], ["🏠", "casa"], ["☀️", "sol"],
  ["🌙", "luna"], ["🐶", "perro"], ["🍎", "manzana"],
  ["🐟", "pez"], ["🌳", "árbol"], ["🚗", "carro"],
];

export const MONOSILABAS: Array<[string, string, string]> = [
  ["ma", "MA", "mama"], ["me", "ME", "miel"], ["mi", "MI", "raton"],
  ["mo", "MO", "manzana"], ["mu", "MU", "vaca"],
  ["pa", "PA", "papa"], ["pe", "PE", "pie"], ["pi", "PI", "pastel"],
  ["po", "PO", "pollo"], ["pu", "PU", "puno"],
  ["sa", "SA", "sal"], ["se", "SE", "silla"], ["si", "SI", "si"],
  ["so", "SO", "sueno"], ["su", "SU", "calcetin"],
  ["la", "LA", "leche"], ["le", "LE", "leon"], ["li", "LI", "libro"],
  ["lo", "LO", "lobo"], ["lu", "LU", "luna"],
];

export const TRABALENGUAS = [
  "Tres tristes tigres tragaban trigo en un trigal.",
  "El cielo está enladrillado, ¿quién lo desenladrillará?",
  "Pablito clavó un clavito en la calva de un calvito.",
];

export const ORACIONES: string[][] = [
  ["El", "niño", "lee", "un", "cuento"],
  ["Mi", "mamá", "prepara", "la", "comida"],
  ["El", "perro", "corre", "en", "el", "parque"],
];

export type Quiz = {
  texto: string;
  pregunta: string;
  opciones: string[];
  correcta: number;
};

export const COMPRENSION: Quiz[] = [
  {
    texto:
      "Ana tiene un gato blanco llamado Nube. A Nube le gusta dormir al sol.",
    pregunta: "¿De qué color es Nube?",
    opciones: ["Negro", "Blanco", "Gris"],
    correcta: 1,
  },
  {
    texto:
      "Luis desayuna fruta todas las mañanas antes de ir a la escuela.",
    pregunta: "¿Qué hace Luis antes de la escuela?",
    opciones: ["Duerme", "Desayuna fruta", "Juega fútbol"],
    correcta: 1,
  },
];

export const SINONIMOS: Array<[string, string[], number]> = [
  ["feliz", ["contento", "triste", "cansado"], 0],
  ["grande", ["pequeño", "enorme", "delgado"], 1],
  ["rápido", ["veloz", "lento", "quieto"], 0],
];

export const ANTONIMOS: Array<[string, string[], number]> = [
  ["día", ["mañana", "noche", "tarde"], 1],
  ["frío", ["caliente", "fresco", "helado"], 0],
  ["alto", ["arriba", "bajo", "largo"], 1],
];

export const RETOS_COGNITIVOS = [
  { pregunta: "¿Qué sigue? 2, 4, 6, __", opciones: ["7", "8", "9"], correcta: 1 },
  { pregunta: "El sol sale por el...", opciones: ["Norte", "Este", "Oeste"], correcta: 1 },
  { pregunta: "¿Cuántas patas tiene un perro?", opciones: ["2", "4", "6"], correcta: 1 },
];

export type Sena = { emoji: string; frase: string; gesto: string; uso: string };

export const SENAS: Sena[] = [
  {
    emoji: "🙋", frase: "Necesito ayuda",
    gesto: "Levanta la mano y muestra la palma abierta hacia el adulto.",
    uso: "En clase o casa cuando algo cuesta o hay demasiado ruido.",
  },
  {
    emoji: "💧", frase: "Quiero agua",
    gesto: "Junta los dedos como si sostuvieras un vaso y llévalo a la boca.",
    uso: "En comidas, recreo o durante actividades largas.",
  },
  {
    emoji: "🚻", frase: "Necesito ir al baño",
    gesto: "Cruza el dedo índice y medio y muéstralos al adulto.",
    uso: "En el aula sin necesidad de hablar frente a otros.",
  },
  {
    emoji: "🍽️", frase: "Tengo hambre",
    gesto: "Lleva los dedos juntos a la boca varias veces.",
    uso: "Antes de merienda o almuerzo.",
  },
  {
    emoji: "😴", frase: "Me siento cansado",
    gesto: "Apoya la mejilla en la mano con los ojos entrecerrados.",
    uso: "Cuando la energía baja o el cuerpo pide pausa.",
  },
  {
    emoji: "🌪️", frase: "Me siento abrumado",
    gesto: "Cubre suavemente los oídos y respira profundo.",
    uso: "Frente a ruido, luz o exceso de estímulos.",
  },
  {
    emoji: "😢", frase: "Estoy triste",
    gesto: "Desliza un dedo por la mejilla como una lágrima.",
    uso: "Para nombrar la emoción sin necesidad de hablar.",
  },
  {
    emoji: "😊", frase: "Estoy feliz",
    gesto: "Sonríe y coloca las manos abiertas junto al rostro.",
    uso: "Para celebrar logros pequeños.",
  },
  {
    emoji: "🙏", frase: "Gracias",
    gesto: "Toca los labios con la mano y llévala hacia adelante.",
    uso: "Al recibir ayuda o algo que se necesitaba.",
  },
  {
    emoji: "🤲", frase: "Por favor",
    gesto: "Frota la palma abierta en círculos sobre el pecho.",
    uso: "Al pedir algo con calma.",
  },
  {
    emoji: "🌞", frase: "Buenos días",
    gesto: "Saluda con la mano abierta desde la frente hacia adelante.",
    uso: "Al llegar a casa o al aula.",
  },
  {
    emoji: "👋", frase: "Adiós",
    gesto: "Agita la mano suavemente de un lado a otro.",
    uso: "Al despedirse sin sobresaltos.",
  },
];

export const SENAS_IMG: Record<string, string> = {
  "Necesito ayuda": "1.png",
  "Quiero agua": "2.png",
  "Necesito ir al baño": "3.png",
  "Tengo hambre": "4.png",
  "Me siento cansado": "5.png",
  "Me siento abrumado": "6.png",
  "Estoy triste": "7.png",
  "Estoy feliz": "10.png",
  Gracias: "8.png",
  "Por favor": "11.png",
  "Buenos días": "12.png",
  Adiós: "9.png",
};

export const EMOCIONES: Array<[string, string]> = [
  ["😊", "Feliz"], ["😢", "Triste"], ["😠", "Enojado"],
  ["😨", "Con miedo"], ["😌", "Tranquilo"], ["🥰", "Querido"],
  ["😴", "Cansado"], ["🌪️", "Abrumado"],
];

export const EMOCIONES_IMG: Record<string, string> = {
  Feliz: "1.png",
  Triste: "2.png",
  Enojado: "3.png",
  "Con miedo": "4.png",
  Tranquilo: "5.png",
  Querido: "6.png",
  Cansado: "7.png",
  Abrumado: "8.png",
};

/* ----------------------------- Matemáticas ----------------------------- */

export const NUMEROS: Array<[number, string]> = [
  [0, "cero"], [1, "uno"], [2, "dos"], [3, "tres"], [4, "cuatro"],
  [5, "cinco"], [6, "seis"], [7, "siete"], [8, "ocho"], [9, "nueve"],
  [10, "diez"], [11, "once"], [12, "doce"], [13, "trece"], [14, "catorce"],
  [15, "quince"], [16, "dieciseis"], [17, "diecisiete"], [18, "dieciocho"],
  [19, "diecinueve"], [20, "veinte"],
];

export const FIGURAS: Array<[string, string, string]> = [
  ["Circulo", "Redondo como el sol", "circulo.png"],
  ["Cuadrado", "Cuatro lados iguales", "cuadrado.png"],
  ["Triangulo", "Tres lados", "triangulo.png"],
  ["Rectangulo", "Dos lados largos", "rectangulo.png"],
  ["Estrella", "Brilla en el cielo", "estrella.png"],
  ["Corazon", "El del carino", "corazon.png"],
];

/* -------------------- Categorías configurables (M5) -------------------- */

export const LEARNING_CATEGORIES: Array<[string, string]> = [
  ["vocales", "Vocales y fonemas"],
  ["silabas", "Construcción silábica"],
  ["vocabulario", "Vocabulario básico"],
  ["comprension", "Comprensión lectora"],
  ["trabalenguas", "Trabalenguas y articulación"],
  ["oraciones", "Construcción de oraciones"],
  ["sinonimos", "Sinónimos y antónimos"],
  ["cognitivo", "Retos cognitivos"],
  ["senas", "Lenguaje de señas"],
  ["emociones", "Expresión emocional"],
  ["matematicas", "Matemáticas (números y figuras)"],
];

export const APP_TITLE = "OCUPAMOR: Aprendiendo con calma";

export function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
