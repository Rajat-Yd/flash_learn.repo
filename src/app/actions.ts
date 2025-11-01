'use server';

import { generateFlashcard, type GenerateFlashcardOutput } from '@/ai/flows/retrieve-up-to-date-information';

type ActionResult = 
  | { success: true; data: GenerateFlashcardOutput }
  | { success: false; error: string };

export async function getFlashcard(topic: string): Promise<ActionResult> {
  if (!topic || topic.trim().length === 0) {
    return { success: false, error: 'Topic cannot be empty.' };
  }

  try {
    const flashcard = await generateFlashcard({ topic });
    return { success: true, data: flashcard };
  } catch (error) {
    console.error('Error generating flashcard:', error);
    // This provides a user-friendly error message.
    // The specific error is logged on the server for debugging.
    return { success: false, error: 'Failed to generate flashcard. The topic may be too broad or unsupported. Please try again with a more specific topic.' };
  }
}
