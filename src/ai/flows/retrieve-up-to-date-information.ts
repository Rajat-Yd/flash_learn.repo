'use server';
/**
 * @fileOverview A flow that retrieves up-to-date information for a given topic using Gemini's web access and formats it into a flashcard.
 *
 * - generateFlashcard - A function that generates a flashcard for a given topic with up-to-date information.
 * - GenerateFlashcardInput - The input type for the generateFlashcard function.
 * - GenerateFlashcardOutput - The return type for the generateFlashcard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardInputSchema = z.object({
  topic: z.string().describe('The topic to generate a flashcard for.'),
});
export type GenerateFlashcardInput = z.infer<typeof GenerateFlashcardInputSchema>;

const GenerateFlashcardOutputSchema = z.object({
  topicName: z.string().describe('The name of the topic.'),
  summary: z.string().describe('A 2-3 line summary of the topic.'),
  keyConcepts: z.array(z.string()).describe('An array of key concepts/subtopics.'),
  example: z.string().describe('A real-world example or use case of the topic.'),
  tip: z.string().describe('A short learning tip or key takeaway.'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the topic.'),
});
export type GenerateFlashcardOutput = z.infer<typeof GenerateFlashcardOutputSchema>;

export async function generateFlashcard(input: GenerateFlashcardInput): Promise<GenerateFlashcardOutput> {
  return generateFlashcardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flashcardPrompt',
  input: {schema: GenerateFlashcardInputSchema},
  output: {schema: GenerateFlashcardOutputSchema},
  prompt: `You are an AI learning assistant with access to real-time information. Generate a short flashcard to teach someone about the topic: "{{topic}}".\nInclude:\n- A 2-3 line summary\n- 3-5 key points (as bullet points)\n- One real-world example or application\n- One short takeaway or tip\n- A difficulty rating (Beginner, Intermediate, or Advanced).\nKeep it concise and easy to understand for a tech professional. Use your access to real-time information to provide up-to-date and accurate details. Format key points as bullet points. Use markdown to bold important keywords.`,
});

const generateFlashcardFlow = ai.defineFlow(
  {
    name: 'generateFlashcardFlow',
    inputSchema: GenerateFlashcardInputSchema,
    outputSchema: GenerateFlashcardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
