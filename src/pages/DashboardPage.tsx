import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Brain,
  Flame,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";
import { getDecks, getStats, formatDuration } from "@/lib/deckStore";

const DashboardPage = () => {
  const decks = getDecks();
  const stats = getStats();
  const weekMs = stats.week.reduce((s, d) => s + d.ms, 0);

  const statCards = [
    { label: "Total Cards", value: String(stats.totalCards), icon: BookOpen, change: `${stats.totalDecks} decks` },
    { label: "Avg Mastery", value: `${stats.avgMastery}%`, icon: Brain, change: "Across all decks" },
    { label: "Study Streak", value: `${stats.streak} day${stats.streak === 1 ? "" : "s"}`, icon: Flame, change: stats.streak === 0 ? "Start studying!" : "Keep it up!" },
    { label: "Study Time", value: formatDuration(weekMs), icon: Clock, change: "This week" },
  ];

  const quickActions = [
    { label: "Generate Flashcards", icon: Sparkles, path: "/generate", variant: "hero" as const },
    { label: "Take a Quiz", icon: Brain, path: "/quiz", variant: "neon" as const },
    { label: "Study Deck", icon: BookOpen, path: "/study", variant: "outline" as const },
    { label: "Study Planner", icon: Target, path: "/planner", variant: "outline" as const },
  ];

  const recentDecks = decks.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Here's your learning overview.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Button key={a.label} variant={a.variant} size="lg" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to={a.path}>
                <a.icon size={20} />
                <span className="text-xs">{a.label}</span>
              </Link>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="glass-card-hover p-5">
              <div className="flex items-center gap-2 mb-3">
                <s.icon size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 gradient-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold mb-1">AI Study Insight</h3>
              <p className="text-sm text-muted-foreground">
                {decks.length === 0
                  ? "Get started by generating your first flashcard deck! Choose a topic or paste your notes."
                  : `You have ${totalCards} cards across ${decks.length} decks. ${avgMastery < 50 ? "Focus on reviewing your existing cards to improve mastery." : "Great progress! Keep reviewing to maintain your knowledge."}`}
              </p>
            </div>
            <Button variant="neon" size="sm" asChild>
              <Link to={decks.length === 0 ? "/generate" : "/study"}>
                {decks.length === 0 ? "Get Started" : "Start Review"} <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>

        {recentDecks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold">Recent Decks</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/decks">View All <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {recentDecks.map((d) => (
                <Link to={`/study?deck=${d.id}`} key={d.id} className="glass-card-hover p-5 block">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{d.name}</h3>
                    <span className="text-xs text-muted-foreground">{d.cards.length} cards</span>
                  </div>
                  <div className="neon-progress-bar mb-2">
                    <div style={{ width: `${d.mastery}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{d.mastery}% mastered</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
