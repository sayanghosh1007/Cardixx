import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  FileText,
  Upload,
  Link2,
  Image,
  PenTool,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  Check,
  Edit2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateFlashcards } from "@/lib/mockAI";
import { saveDeck } from "@/lib/deckStore";
import { useToast } from "@/hooks/use-toast";

type InputMethod = "topic" | "notes" | "document" | "url" | "image" | "manual";
type Step = "input" | "generating" | "preview";

const methods: { id: InputMethod; icon: any; label: string; desc: string }[] = [
  { id: "topic", icon: Zap, label: "Topic Name", desc: "Enter a topic and AI generates cards" },
  { id: "notes", icon: FileText, label: "Notes / Text", desc: "Paste lecture notes or study material" },
  { id: "document", icon: Upload, label: "Document Upload", desc: "Upload PDF, DOC, TXT, or PPT" },
  { id: "url", icon: Link2, label: "URL / Link", desc: "Paste a blog or documentation URL" },
  { id: "image", icon: Image, label: "Image Upload", desc: "Upload notebook or whiteboard photos" },
  { id: "manual", icon: PenTool, label: "Manual Creation", desc: "Create flashcards manually" },
];

const GeneratePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMethod, setActiveMethod] = useState<InputMethod>("topic");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [step, setStep] = useState<Step>("input");


  // Input states
  const [topicInput, setTopicInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [manualCards, setManualCards] = useState([{ q: "", a: "" }]);

  // Preview state
  const [generatedCards, setGeneratedCards] = useState<{ question: string; answer: string }[]>([]);
  const [deckName, setDeckName] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const getInputValue = () => {
    switch (activeMethod) {
      case "topic": return topicInput;
      case "notes": return notesInput;
      case "url": return urlInput;
      default: return "";
    }
  };

  const canGenerate = () => {
    if (activeMethod === "manual") {
      return manualCards.some((c) => c.q.trim() && c.a.trim());
    }
    if (activeMethod === "document" || activeMethod === "image") return true;
    return getInputValue().trim().length > 0;
  };

  const handleGenerate = async () => {
    if (activeMethod === "manual") {
      const valid = manualCards.filter((c) => c.q.trim() && c.a.trim());
      if (valid.length === 0) return;
      setGeneratedCards(valid.map((c) => ({ question: c.q, answer: c.a })));
      setDeckName("My Flashcards");
      setStep("preview");
      return;
    }

    setStep("generating");
    const input = getInputValue();
    const name = activeMethod === "topic" ? input : activeMethod === "url" ? new URL(input).hostname : activeMethod === "notes" ? input.substring(0, 30) + "..." : "Uploaded Content";
    setDeckName(name);

    try {
      const cards = await generateFlashcards(activeMethod, input);
      setGeneratedCards(cards);
      setStep("preview");
    } catch {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
      setStep("input");
    }
  };

  const handleSaveDeck = () => {
    if (!deckName.trim() || generatedCards.length === 0) return;
    saveDeck(deckName.trim(), generatedCards);
    toast({ title: "Deck saved!", description: `"${deckName}" with ${generatedCards.length} cards.` });
    navigate("/decks");
  };

  const handleEditCard = (idx: number, field: "question" | "answer", value: string) => {
    setGeneratedCards((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  };

  const handleDeleteCard = (idx: number) => {
    setGeneratedCards((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    setStep("input");
    setGeneratedCards([]);
    setDeckName("");
    setEditingIdx(null);
  };

  // Generating state
  if (step === "generating") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="glass-card p-12 text-center gradient-border">
            <Loader2 size={48} className="mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-xl font-display font-bold mb-2">Generating Flashcards...</h2>
            <p className="text-sm text-muted-foreground">AI is analyzing your content and creating smart flashcards.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Preview state
  if (step === "preview") {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold mb-1">Preview Flashcards</h1>
              <p className="text-sm text-muted-foreground">{generatedCards.length} cards generated — review and edit before saving.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>← Back</Button>
              <Button variant="hero" size="sm" onClick={handleSaveDeck}>
                <Save size={16} /> Save Deck
              </Button>
            </div>
          </div>

          {/* Deck name */}
          <div className="glass-card p-4 flex items-center gap-3">
            <Label className="text-sm whitespace-nowrap">Deck Name:</Label>
            <Input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="bg-muted border-glass-border max-w-xs"
            />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {generatedCards.map((card, idx) => (
              <div key={idx} className="glass-card-hover p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-primary font-semibold">Card {idx + 1}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}>
                      {editingIdx === idx ? <Check size={14} /> : <Edit2 size={14} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteCard(idx)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {editingIdx === idx ? (
                  <div className="space-y-2">
                    <Input
                      value={card.question}
                      onChange={(e) => handleEditCard(idx, "question", e.target.value)}
                      className="bg-muted border-glass-border text-sm"
                    />
                    <Textarea
                      value={card.answer}
                      onChange={(e) => handleEditCard(idx, "answer", e.target.value)}
                      className="bg-muted border-glass-border text-sm min-h-[80px]"
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-sm mb-1">{card.question}</p>
                    <p className="text-sm text-muted-foreground">{card.answer}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="hero" size="lg" onClick={handleSaveDeck}>
              <Save size={18} /> Save Deck ({generatedCards.length} cards)
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Input state
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
            <Sparkles className="inline mr-2 text-primary" size={28} />
            Generate Flashcards
          </h1>
          <p className="text-muted-foreground">Choose an input method and let AI create your flashcards.</p>
        </div>

        {/* Method selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMethod(m.id)}
              className={cn(
                "glass-card p-4 text-left transition-all duration-200",
                activeMethod === m.id
                  ? "border-primary/50 neon-glow-blue"
                  : "hover:border-glass-border/80"
              )}
            >
              <m.icon size={20} className={activeMethod === m.id ? "text-primary" : "text-muted-foreground"} />
              <p className="font-semibold text-sm mt-2">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="glass-card p-6">
          {activeMethod === "topic" && (
            <div className="space-y-4">
              <Label>Enter a Topic</Label>
              <Input
                placeholder="e.g., Binary Search, Photosynthesis, Python Lists..."
                className="bg-muted border-glass-border"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canGenerate() && handleGenerate()}
              />
            </div>
          )}

          {activeMethod === "notes" && (
            <div className="space-y-4">
              <Label>Paste Your Notes</Label>
              <Textarea
                placeholder="Paste your lecture notes, study material, or any text content here..."
                className="bg-muted border-glass-border min-h-[200px]"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
              />
            </div>
          )}

          {activeMethod === "document" && (
            <div className="space-y-4">
              <Label>Upload Document</Label>
              <div
                className="border-2 border-dashed border-glass-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer"
                onClick={handleGenerate}
              >
                <Upload size={40} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to simulate document upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, TXT, PPT, PPTX</p>
              </div>
            </div>
          )}

          {activeMethod === "url" && (
            <div className="space-y-4">
              <Label>Paste URL</Label>
              <Input
                placeholder="https://example.com/article..."
                className="bg-muted border-glass-border"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canGenerate() && handleGenerate()}
              />
              <p className="text-xs text-muted-foreground">Blogs, documentation, educational articles</p>
            </div>
          )}

          {activeMethod === "image" && (
            <div className="space-y-4">
              <Label>Upload Image</Label>
              <div
                className="border-2 border-dashed border-glass-border rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer"
                onClick={handleGenerate}
              >
                <Image size={40} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to simulate image upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG</p>
              </div>
            </div>
          )}

          {activeMethod === "manual" && (
            <div className="space-y-4">
              <Label>Create Flashcards Manually</Label>
              {manualCards.map((card, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Question"
                      value={card.q}
                      onChange={(e) => {
                        const next = [...manualCards];
                        next[i].q = e.target.value;
                        setManualCards(next);
                      }}
                      className="bg-muted border-glass-border"
                    />
                    <Input
                      placeholder="Answer"
                      value={card.a}
                      onChange={(e) => {
                        const next = [...manualCards];
                        next[i].a = e.target.value;
                        setManualCards(next);
                      }}
                      className="bg-muted border-glass-border"
                    />
                  </div>
                  {manualCards.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => setManualCards(manualCards.filter((_, j) => j !== i))}>
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setManualCards([...manualCards, { q: "", a: "" }])}>
                <Plus size={14} /> Add Card
              </Button>
            </div>
          )}

          {activeMethod !== "document" && activeMethod !== "image" && (
            <div className="mt-6">
              <Button variant="hero" size="lg" onClick={handleGenerate} disabled={!canGenerate()}>
                <Sparkles size={18} />
                {activeMethod === "manual" ? "Preview Cards" : "Generate Flashcards"}
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneratePage;
