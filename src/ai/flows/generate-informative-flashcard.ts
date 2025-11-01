'use server';

/**
 * @fileOverview Generates an informative flashcard for a given tech topic.
 *
 * - generateInformativeFlashcard - A function that generates the flashcard.
 * - GenerateInformativeFlashcardInput - The input type for the generateInformativeFlashcard function.
 * - GenerateInformativeFlashcardOutput - The return type for the generateInformativeFlashcard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInformativeFlashcardInputSchema = z.object({
  topic: z.string().describe('The tech topic to generate a flashcard for.'),
});
export type GenerateInformativeFlashcardInput = z.infer<typeof GenerateInformativeFlashcardInputSchema>;

const GenerateInformativeFlashcardOutputSchema = z.object({
  topic: z.string().describe('The topic of the flashcard.'),
  summary: z.string().describe('A 2-3 line summary of the topic.'),
  keyConcepts: z.array(z.string()).describe('3-5 key concepts/subtopics related to the topic.'),
  example: z.string().describe('A real-world example or use case of the topic.'),
  tip: z.string().describe('A short learning tip or key takeaway for the topic.'),
});
export type GenerateInformativeFlashcardOutput = z.infer<typeof GenerateInformativeFlashcardOutputSchema>;

export async function generateInformativeFlashcard(
  input: GenerateInformativeFlashcardInput
): Promise<GenerateInformativeFlashcardOutput> {
  return generateInformativeFlashcardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInformativeFlashcardPrompt',
  input: {schema: GenerateInformativeFlashcardInputSchema},
  output: {schema: GenerateInformativeFlashcardOutputSchema},
  prompt: `You are an AI learning assistant. Generate a short flashcard to teach someone about the topic: "{{topic}}". Include: - 2-line summary - 3-5 key points - One real-world example or application - One short takeaway or tip. Keep it concise and easy to understand for a tech professional.`,
});

const generateInformativeFlashcardFlow = ai.defineFlow(
  {
    name: 'generateInformativeFlashcardFlow',
    inputSchema: GenerateInformativeFlashcardInputSchema,
    outputSchema: GenerateInformativeFlashcardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
