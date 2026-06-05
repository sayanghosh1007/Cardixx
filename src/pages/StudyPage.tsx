import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, ThumbsDown, Minus, ThumbsUp, BookOpen } from "lucide-react";
import { getDeck, getDecks, updateCardDifficulty, logSession } from "@/lib/deckStore";

const StudyPage = () => {
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get("deck");

  const deck = deckId ? getDeck(deckId) : undefined;
  const allDecks = getDecks();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[] | null>(null);

  const cards = deck?.cards || [];
  const indices = shuffledIndices || cards.map((_, i) => i);
  const card = cards[indices[currentIndex]];

  const startRef = useRef<number>(Date.now());
  const reviewedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    startRef.current = Date.now();
    reviewedRef.current = new Set();
    return () => {
      if (deck && reviewedRef.current.size > 0) {
        const now = Date.now();
        logSession({
          deckId: deck.id,
          deckName: deck.name,
          cardsReviewed: reviewedRef.current.size,
          durationMs: now - startRef.current,
          startedAt: new Date(startRef.current).toISOString(),
          endedAt: new Date(now).toISOString(),
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck?.id]);

  const handleShuffle = () => {
    const arr = cards.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledIndices(arr);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const next = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, cards.length - 1)), 150);
  };

  const prev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(i - 1, 0)), 150);
  };

  const handleDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    if (deck && card) {
      updateCardDifficulty(deck.id, card.id, difficulty);
      reviewedRef.current.add(card.id);
    }
    next();
  };

  // No deck selected — show deck picker
  if (!deck) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-1">Study Mode</h1>
            <p className="text-muted-foreground text-sm">Select a deck to study.</p>
          </div>

          {allDecks.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <BookOpen size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display font-semibold mb-2">No decks available</h3>
              <p className="text-sm text-muted-foreground mb-4">Create a deck first to start studying.</p>
              <Button variant="hero" size="sm" asChild>
                <Link to="/generate">Generate Flashcards</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {allDecks.map((d) => (
                <Link key={d.id} to={`/study?deck=${d.id}`} className="glass-card-hover p-5 block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen size={18} className="text-primary" />
                      <div>
                        <h3 className="font-semibold">{d.name}</h3>
                        <p className="text-xs text-muted-foreground">{d.cards.length} cards · {d.mastery}% mastered</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (cards.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center glass-card p-12 max-w-md mx-auto">
          <p className="text-muted-foreground">This deck has no cards.</p>
          <Button variant="hero" size="sm" className="mt-4" asChild>
            <Link to="/generate">Generate Cards</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-1">Study Mode</h1>
          <p className="text-muted-foreground text-sm">{deck.name} · {cards.length} cards</p>
        </div>

        {/* Progress */}
        <div className="neon-progress-bar">
          <div style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
        </div>
        <p className="text-center text-xs text-muted-foreground">{currentIndex + 1} / {cards.length}</p>

        {/* Flashcard */}
        <div
          className="relative cursor-pointer mx-auto"
          style={{ perspective: "1000px", minHeight: "300px" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="w-full h-full transition-transform duration-500 relative"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <div
              className="absolute inset-0 glass-card gradient-border p-8 flex flex-col items-center justify-center text-center"
              style={{ backfaceVisibility: "hidden", minHeight: "300px" }}
            >
              <p className="text-xs text-primary mb-4 font-semibold uppercase tracking-wider">Question</p>
              <p className="text-xl font-display font-semibold">{card.question}</p>
              <p className="text-xs text-muted-foreground mt-6">Click to reveal answer</p>
            </div>

            <div
              className="absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center border border-primary/30"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", minHeight: "300px" }}
            >
              <p className="text-xs text-accent mb-4 font-semibold uppercase tracking-wider">Answer</p>
              <p className="text-lg leading-relaxed">{card.answer}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={prev} disabled={currentIndex === 0}>
            <ChevronLeft size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShuffle}>
            <Shuffle size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}>
            <RotateCcw size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={next} disabled={currentIndex === cards.length - 1}>
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Difficulty rating */}
        {isFlipped && (
          <div className="flex justify-center gap-3 animate-fade-in">
            <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleDifficulty("hard")}>
              <ThumbsDown size={14} /> Hard
            </Button>
            <Button variant="outline" size="sm" className="border-accent/30 text-accent hover:bg-accent/10" onClick={() => handleDifficulty("medium")}>
              <Minus size={14} /> Medium
            </Button>
            <Button variant="outline" size="sm" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10" onClick={() => handleDifficulty("easy")}>
              <ThumbsUp size={14} /> Easy
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudyPage;
