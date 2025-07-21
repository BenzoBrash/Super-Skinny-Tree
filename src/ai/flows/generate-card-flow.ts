'use server';
/**
 * @fileOverview An AI flow for generating personalized greeting card content.
 *
 * - generateCardContent - A function that creates card ideas based on user inputs.
 * - GenerateCardInput - The input type for the function.
 * - GenerateCardOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const GenerateCardInputSchema = z.object({
  occasion: z.string().describe("The reason for the card, e.g., '50th Birthday', 'Anniversary', 'Christmas'."),
  tone: z.string().describe("The desired tone or style of the card, e.g., 'Funny', 'Heartfelt', 'Formal'."),
  imagery: z.string().optional().describe("Specific ideas for the card's visual imagery, e.g., 'dogs playing poker', 'a serene beach sunset'."),
  personalNote: z.string().optional().describe("A personal message or inside joke from the user to incorporate."),
  recipientName: z.string().optional().describe("The name of the person receiving the card."),
});
export type GenerateCardInput = z.infer<typeof GenerateCardInputSchema>;


const CardIdeaSchema = z.object({
    headline: z.string().describe("A short, catchy headline for the card's front."),
    message: z.string().describe("The body message for the inside of the card. It should be personal, warm, and reflect the tone from the prompt."),
    imagePrompt: z.string().describe("A creative and simple prompt for an AI image generator to create a visual for the card. E.g., 'A cartoon golf ball wearing a party hat'."),
});

export const GenerateCardOutputSchema = z.object({
    options: z.array(CardIdeaSchema).min(2).max(3).describe("An array of 2 to 3 distinct card ideas."),
});
export type GenerateCardOutput = z.infer<typeof GenerateCardOutputSchema>;
export type CardIdea = z.infer<typeof CardIdeaSchema>;


export async function generateCardContent(input: GenerateCardInput): Promise<GenerateCardOutput> {
  return generateCardFlow(input);
}

const cardGenerationPrompt = ai.definePrompt({
  name: 'generateCardPrompt',
  input: {schema: GenerateCardInputSchema},
  output: {schema: GenerateCardOutputSchema},
  prompt: `You are a creative and witty greeting card writer. A user will provide structured details for a card they want to create. Your task is to generate 2 to 3 unique and compelling options for them.

Each option must include:
1.  A short, engaging headline for the front of the card.
2.  A heartfelt, funny, or appropriate message for the body of the card.
3.  A simple but creative "imagePrompt" that could be fed into an AI image generator for the card's main visual.

**Card Details:**
- **Occasion:** {{occasion}}
- **Desired Tone:** {{tone}}
{{#if recipientName}}- **Recipient:** {{recipientName}}{{/if}}
{{#if imagery}}- **Imagery Ideas:** {{imagery}}{{/if}}
{{#if personalNote}}- **Personal Note to Incorporate:** "{{personalNote}}"{{/if}}

Please incorporate the personal note seamlessly into the message if provided. The card must be tailored to the recipient and occasion. Generate the options now.
`,
});

const generateCardFlow = ai.defineFlow(
  {
    name: 'generateCardFlow',
    inputSchema: GenerateCardInputSchema,
    outputSchema: GenerateCardOutputSchema,
  },
  async (input) => {
    const {output} = await cardGenerationPrompt(input);
    return output!;
  }
);
