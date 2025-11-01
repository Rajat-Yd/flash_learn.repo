'use server';

/**
 * @fileOverview Generates a short, two-sentence summary for a given topic.
 *
 * - generateShortSummary - A function that generates the short summary.
 * - GenerateShortSummaryInput - The input type for the generateShortSummary function.
 * - GenerateShortSummaryOutput - The return type for the generateShortSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShortSummaryInputSchema = z.object({
  topic: z.string().describe('The topic to summarize.'),
});
export type GenerateShortSummaryInput = z.infer<typeof GenerateShortSummaryInputSchema>;

const GenerateShortSummaryOutputSchema = z.object({
  summary: z.string().describe('A two-sentence summary of the topic.'),
});
export type GenerateShortSummaryOutput = z.infer<typeof GenerateShortSummaryOutputSchema>;

export async function generateShortSummary(
  input: GenerateShortSummaryInput
): Promise<GenerateShortSummaryOutput> {
  return generateShortSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShortSummaryPrompt',
  input: {schema: GenerateShortSummaryInputSchema},
  output: {schema: GenerateShortSummaryOutputSchema},
  prompt: `You are an AI learning assistant. Summarize the following topic in exactly two sentences: "{{topic}}".`,
});

const generateShortSummaryFlow = ai.defineFlow(
  {
    name: 'generateShortSummaryFlow',
    inputSchema: GenerateShortSummaryInputSchema,
    outputSchema: GenerateShortSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
