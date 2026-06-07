import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CardixLogo from "@/components/CardixLogo";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Brain,
  Sparkles,
  BookOpen,
  Target,
  Trophy,
  BarChart3,
  FileText,
  Link2,
  Image,
  Zap,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Flashcard Generator", desc: "Generate flashcards from topics, notes, documents, URLs, or images.", color: "neon-blue" },
  { icon: Brain, title: "Spaced Repetition", desc: "AI schedules reviews for optimal memory retention.", color: "neon-purple" },
  { icon: BookOpen, title: "AI Quiz Generator", desc: "Auto-generate quizzes in multiple formats from any content.", color: "neon-cyan" },
  { icon: Target, title: "AI Study Planner", desc: "Personalized study plans based on your progress and weak areas.", color: "neon-blue" },
  { icon: BarChart3, title: "Progress Analytics", desc: "Track your learning with detailed stats and weekly reports.", color: "neon-purple" },
  { icon: Trophy, title: "Study History", desc: "Track your past sessions, review completed topics, and monitor your learning journey.", color: "neon-cyan" },
];

const inputMethods = [
  { icon: Zap, label: "Topic Name" },
  { icon: FileText, label: "Notes & Text" },
  { icon: FileText, label: "Document Upload" },
  { icon: Link2, label: "URL / Link" },
  { icon: Image, label: "Image / Photo" },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 container text-center py-20">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-8">
              <CardixLogo size="xl" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 font-medium tracking-wide">
              Train Your Brain Smarter.
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              AI-Powered <span className="gradient-text">Flashcards</span>
              <br />
              & <span className="gradient-text">Quizzes</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate intelligent flashcards and quizzes from any content.
              Master any subject with spaced repetition and AI-driven study plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Open App
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </div>

          </div>

          {/* Input methods */}
          <div className="mt-16 flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.3s" }}>
            {inputMethods.map((m) => (
              <div
                key={m.label}
                className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <m.icon size={14} className="text-primary" />
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gradient-text">Learn Faster</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              CARDIX combines AI intelligence with proven learning science to help you master any subject.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card-hover p-6 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10 text-primary group-hover:neon-glow-blue transition-all duration-300`}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Three Steps to <span className="gradient-text">Mastery</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Input Your Content", desc: "Upload documents, paste notes, enter a topic, or share a URL." },
              { step: "02", title: "AI Generates Cards", desc: "Our AI creates smart flashcards and quizzes from your content." },
              { step: "03", title: "Study & Master", desc: "Use spaced repetition and AI study plans to retain knowledge." },
            ].map((s, i) => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-display font-bold gradient-text mb-4">{s.step}</div>
                <h3 className="text-lg font-display font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container text-center">
          <div className="glass-card p-12 md:p-16 gradient-border max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to <span className="gradient-text">Train Your Brain?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students and professionals who are learning smarter with CARDIX.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard">
                Open App
                <ArrowRight size={20} />
              </Link>
            </Button>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <CardixLogo size="sm" />
          <p className="text-sm text-muted-foreground">
            © 2026 CARDIX. Train Your Brain Smarter.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;