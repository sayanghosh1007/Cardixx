import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Brain, CheckCircle2, XCircle, ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react";
import { getDeck, getDecks, logQuizResult, type Flashcard } from "@/lib/deckStore";

function generateQuizQuestions(cards: Flashcard[]) {
  return cards.slice(0, 10).map((card) => {
    const correctAnswer = card.answer.length > 80 ? card.answer.substring(0, 80) + "..." : card.answer;
    const distractors = [
      "This concept is not directly related to the topic at hand.",
      "The opposite of the correct principle applies in this case.",
      "This is a common misconception about the subject.",
    ];
    const options = [correctAnswer, ...distractors.slice(0, 3)];
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      q: card.question,
      options,
      correct: options.indexOf(correctAnswer),
      explanation: card.answer,
    };
  });
}

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get("deck");

  const deck = deckId ? getDeck(deckId) : undefined;
  const allDecks = getDecks();

  const [questions, setQuestions] = useState<ReturnType<typeof generateQuizQuestions>>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const startQuiz = (d: typeof deck) => {
    if (!d || d.cards.length === 0) return;
    const qs = generateQuizQuestions(d.cards);
    setQuestions(qs);
    setStarted(true);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResults(false);
  };

  // Deck picker
  if (!started) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-1">
              <Brain className="inline mr-2 text-primary" size={28} />
              Quiz Mode
            </h1>
            <p className="text-muted-foreground text-sm">Select a deck to quiz yourself.</p>
          </div>

          {allDecks.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <BookOpen size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display font-semibold mb-2">No decks available</h3>
              <p className="text-sm text-muted-foreground mb-4">Create a deck first to take a quiz.</p>
              <Button variant="hero" size="sm" asChild>
                <Link to="/generate">Generate Flashcards</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {allDecks.map((d) => (
                <button
                  key={d.id}
                  onClick={() => startQuiz(d)}
                  className="glass-card-hover p-5 w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain size={18} className="text-primary" />
                      <div>
                        <h3 className="font-semibold">{d.name}</h3>
                        <p className="text-xs text-muted-foreground">{d.cards.length} cards</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[current];
  const isAnswered = selected !== null;
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const finalScore = newAnswers.filter((a, i) => a === questions[i].correct).length;
      if (deck) {
        logQuizResult({
          deckId: deck.id,
          deckName: deck.name,
          total: questions.length,
          correct: finalScore,
          takenAt: new Date().toISOString(),
        });
      }
      setShowResults(true);
    }
  };

  if (showResults) {
    const finalScore = answers.filter((a, i) => a === questions[i].correct).length;
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8 text-center animate-fade-in">
          <div className="glass-card p-10 gradient-border">
            <Brain size={48} className="mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h1>
            <p className="text-5xl font-display font-bold gradient-text my-6">
              {finalScore}/{questions.length}
            </p>
            <p className="text-muted-foreground mb-6">
              {finalScore === questions.length ? "Perfect score! 🎉" : finalScore >= questions.length / 2 ? "Good job! Keep studying. 💪" : "Review the material and try again. 📚"}
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="hero" onClick={() => startQuiz(deck || allDecks.find((d) => d.id === deckId))}>
                Retry Quiz
              </Button>
              <Button variant="outline" onClick={() => setStarted(false)}>
                Pick Another Deck
              </Button>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h2 className="font-display font-semibold text-lg">Review Answers</h2>
            {questions.map((q, i) => (
              <div key={i} className={cn("glass-card p-5", answers[i] === q.correct ? "border-neon-green/20" : "border-destructive/20")}>
                <p className="font-semibold mb-2">{q.q}</p>
                <p className="text-sm">
                  {answers[i] === q.correct ? (
                    <span className="text-neon-green flex items-center gap-1"><CheckCircle2 size={14} /> Correct</span>
                  ) : (
                    <span className="text-destructive flex items-center gap-1"><XCircle size={14} /> Incorrect</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold">Quiz Mode</h1>
            <p className="text-sm text-muted-foreground">{deck?.name || "Quiz"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            {current + 1}/{questions.length}
          </div>
        </div>

        <div className="neon-progress-bar">
          <div style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="glass-card p-8">
          <p className="text-lg font-display font-semibold mb-6">{question.q}</p>
          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm",
                  selected === null && "border-glass-border hover:border-primary/30 hover:bg-muted",
                  selected === idx && idx === question.correct && "border-neon-green/50 bg-neon-green/10",
                  selected === idx && idx !== question.correct && "border-destructive/50 bg-destructive/10",
                  selected !== null && idx === question.correct && selected !== idx && "border-neon-green/30",
                  selected !== null && selected !== idx && idx !== question.correct && "opacity-50"
                )}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt}
                {isAnswered && idx === question.correct && <CheckCircle2 size={16} className="inline ml-2 text-neon-green" />}
                {isAnswered && selected === idx && idx !== question.correct && <XCircle size={16} className="inline ml-2 text-destructive" />}
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground animate-fade-in">
              <strong className="text-foreground">Explanation:</strong> {question.explanation}
            </div>
          )}
        </div>

        {isAnswered && (
          <div className="flex justify-end animate-fade-in">
            <Button variant="hero" onClick={handleNext}>
              {current < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizPage;
