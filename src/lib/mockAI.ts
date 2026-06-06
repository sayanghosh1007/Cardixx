// AI flashcard generation via Lovable Cloud edge function
import { supabase } from "@/integrations/supabase/client";

interface GeneratedCard {
  question: string;
  answer: string;
}

export async function generateFlashcards(
  method: string,
  input: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<GeneratedCard[]> {
  const effectiveInput = input?.trim() || "general knowledge";
  const { data, error } = await supabase.functions.invoke("generate-flashcards", {
    body: { method, input: effectiveInput, count: 10, difficulty },
  });
  if (error) throw error;
  if (!data?.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
    throw new Error("No cards returned");
  }
  return data.cards as GeneratedCard[];
}

