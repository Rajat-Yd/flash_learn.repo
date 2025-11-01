'use server';

/**
 * @fileOverview Generates a detailed explanation for a given topic.
 *
 * - generateDetailedExplanation - A function that generates the detailed explanation.
 * - GenerateDetailedExplanationInput - The input type for the generateDetailedExplanation function.
 * - GenerateDetailedExplanationOutput - The return type for the generateDetailedExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDetailedExplanationInputSchema = z.object({
  topic: z.string().describe('The topic to explain in detail.'),
});
export type GenerateDetailedExplanationInput = z.infer<typeof GenerateDetailedExplanationInputSchema>;

const GenerateDetailedExplanationOutputSchema = z.object({
  explanation: z.string().describe('A detailed, multi-paragraph explanation of the topic, suitable for someone who wants to learn more. Use Markdown for formatting (e.g., paragraphs, bolding, lists).'),
});
export type GenerateDetailedExplanationOutput = z.infer<typeof GenerateDetailedExplanationOutputSchema>;

export async function generateDetailedExplanation(
  input: GenerateDetailedExplanationInput
): Promise<GenerateDetailedExplanationOutput> {
  return generateDetailedExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedExplanationPrompt',
  input: {schema: GenerateDetailedExplanationInputSchema},
  output: {schema: GenerateDetailedExplanationOutputSchema},
  prompt: `You are an AI learning assistant. A user wants to learn more about the topic: "{{topic}}". Provide a detailed, multi-paragraph explanation. Go deeper than a simple summary. Explain the context, how it works, and its importance. Use markdown for formatting, like paragraphs, bolding key terms, and lists.`,
});

const generateDetailedExplanationFlow = ai.defineFlow(
  {
    name: 'generateDetailedExplanationFlow',
    inputSchema: GenerateDetailedExplanationInputSchema,
    outputSchema: GenerateDetailedExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
