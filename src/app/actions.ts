'use server';

import { generateFlashcard, type GenerateFlashcardOutput } from '@/ai/flows/retrieve-up-to-date-information';
import { generateShortSummary, type GenerateShortSummaryOutput } from '@/ai/flows/generate-short-summary';
import { generateDetailedExplanation, type GenerateDetailedExplanationOutput } from '@/ai/flows/generate-detailed-explanation';

type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function getFlashcard(topic: string): Promise<ActionResult<GenerateFlashcardOutput>> {
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

export async function getShortSummary(topic: string): Promise<ActionResult<GenerateShortSummaryOutput>> {
    if (!topic || topic.trim().length === 0) {
        return { success: false, error: 'Topic cannot be empty.' };
    }

    try {
        const shortSummary = await generateShortSummary({ topic });
        return { success: true, data: shortSummary };
    } catch (error) {
        console.error('Error generating short summary:', error);
        return { success: false, error: 'Failed to generate short summary.' };
    }
}


export async function getDetailedExplanation(topic: string): Promise<ActionResult<GenerateDetailedExplanationOutput>> {
    if (!topic || topic.trim().length === 0) {
        return { success: false, error: 'Topic cannot be empty.' };
    }

    try {
        const detailedExplanation = await generateDetailedExplanation({ topic });
        return { success: true, data: detailedExplanation };
    } catch (error) {
        console.error('Error generating detailed explanation:', error);
        return { success: false, error: 'Failed to generate detailed explanation.' };
    }
}
