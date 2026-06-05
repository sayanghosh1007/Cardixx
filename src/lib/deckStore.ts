export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: string;
  nextReview?: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: string;
  lastStudied?: string;
  mastery: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  deckName: string;
  cardsReviewed: number;
  durationMs: number;
  startedAt: string;
  endedAt: string;
}

export interface QuizResult {
  id: string;
  deckId: string;
  deckName: string;
  total: number;
  correct: number;
  takenAt: string;
}

const STORAGE_KEY = "hexon_decks";
const SESSIONS_KEY = "hexon_sessions";
const QUIZZES_KEY = "hexon_quizzes";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function getDecks(): Deck[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getDeck(id: string): Deck | undefined {
  return getDecks().find((d) => d.id === id);
}

export function saveDeck(name: string, cards: { question: string; answer: string }[]): Deck {
  const decks = getDecks();
  const deck: Deck = {
    id: generateId(),
    name,
    cards: cards.map((c) => ({
      id: generateId(),
      question: c.question,
      answer: c.answer,
    })),
    createdAt: new Date().toISOString(),
    mastery: 0,
  };
  decks.unshift(deck);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  return deck;
}

export function updateDeck(id: string, updates: Partial<Deck>): void {
  const decks = getDecks().map((d) => (d.id === id ? { ...d, ...updates } : d));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function deleteDeck(id: string): void {
  const decks = getDecks().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function updateCardDifficulty(deckId: string, cardId: string, difficulty: "easy" | "medium" | "hard"): void {
  const decks = getDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  deck.cards = deck.cards.map((c) =>
    c.id === cardId ? { ...c, difficulty, lastReviewed: new Date().toISOString() } : c
  );
  const mastered = deck.cards.filter((c) => c.difficulty === "easy").length;
  deck.mastery = Math.round((mastered / deck.cards.length) * 100);
  deck.lastStudied = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

// ---- Study sessions ----
export function getSessions(): StudySession[] {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function logSession(s: Omit<StudySession, "id">): void {
  const sessions = getSessions();
  sessions.unshift({ ...s, id: generateId() });
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 500)));
}

// ---- Quiz results ----
export function getQuizResults(): QuizResult[] {
  try {
    return JSON.parse(localStorage.getItem(QUIZZES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function logQuizResult(r: Omit<QuizResult, "id">): void {
  const results = getQuizResults();
  results.unshift({ ...r, id: generateId() });
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(results.slice(0, 500)));
}

// ---- Stats helpers ----
export function getStats() {
  const decks = getDecks();
  const sessions = getSessions();
  const quizzes = getQuizResults();
  const totalCards = decks.reduce((s, d) => s + d.cards.length, 0);
  const totalMs = sessions.reduce((s, x) => s + x.durationMs, 0);
  const totalCardsReviewed = sessions.reduce((s, x) => s + x.cardsReviewed, 0);
  const avgMastery = decks.length > 0 ? Math.round(decks.reduce((s, d) => s + d.mastery, 0) / decks.length) : 0;

  // streak: count consecutive days back from today with at least one session
  const days = new Set(sessions.map((s) => new Date(s.startedAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  // weekly breakdown
  const week: { day: string; cards: number; ms: number; date: string }[] = [];
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const daySessions = sessions.filter((s) => new Date(s.startedAt).toDateString() === key);
    week.push({
      day: labels[d.getDay()],
      cards: daySessions.reduce((s, x) => s + x.cardsReviewed, 0),
      ms: daySessions.reduce((s, x) => s + x.durationMs, 0),
      date: key,
    });
  }

  return {
    totalDecks: decks.length,
    totalCards,
    totalCardsReviewed,
    totalStudyMs: totalMs,
    avgMastery,
    streak,
    quizzesTaken: quizzes.length,
    week,
  };
}

export function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
