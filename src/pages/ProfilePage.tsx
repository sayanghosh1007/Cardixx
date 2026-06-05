import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Flame, Clock, Sparkles, Layers, History } from "lucide-react";
import { getDecks, getStats, formatDuration } from "@/lib/deckStore";

const ProfilePage = () => {
  const decks = getDecks();
  const stats = getStats();
  const maxCards = Math.max(1, ...stats.week.map((d) => d.cards));

  const statCards = [
    { label: "Total Decks", value: String(stats.totalDecks), icon: Layers },
    { label: "Total Cards", value: String(stats.totalCards), icon: BookOpen },
    { label: "Cards Reviewed", value: String(stats.totalCardsReviewed), icon: Brain },
    { label: "Quizzes Taken", value: String(stats.quizzesTaken), icon: Brain },
    { label: "Study Streak", value: `${stats.streak} day${stats.streak === 1 ? "" : "s"}`, icon: Flame },
    { label: "Study Time", value: formatDuration(stats.totalStudyMs), icon: Clock },
    { label: "Avg Mastery", value: `${stats.avgMastery}%`, icon: Sparkles },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Study Statistics</h1>
          <p className="text-muted-foreground text-sm">Real-time stats and your flashcard creation history.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <s.icon size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-xl font-display font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly Report */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">This Week</h2>
          {stats.totalStudyMs === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No study sessions yet. Start studying to see your weekly activity.</p>
          ) : (
            <div className="space-y-3">
              {stats.week.map((d) => (
                <div key={d.date} className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-8">{d.day}</span>
                  <div className="flex-1 neon-progress-bar">
                    <div style={{ width: `${(d.cards / maxCards) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">{d.cards} cards</span>
                  <span className="text-xs text-muted-foreground w-16 text-right">{formatDuration(d.ms)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flashcard creation history */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <History size={18} className="text-primary" /> Flashcard Creation History
          </h2>
          {decks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">You haven't created any flashcards yet.</p>
              <Button variant="hero" size="sm" asChild>
                <Link to="/generate">Generate Flashcards</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {decks.map((d) => (
                <Link
                  key={d.id}
                  to={`/study?deck=${d.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(d.createdAt).toLocaleString()} · {d.cards.length} cards · {d.mastery}% mastered
                    </p>
                  </div>
                  <span className="text-xs text-primary">Open →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
