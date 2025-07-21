'use server';
/**
 * @fileOverview An AI flow for generating two distinct card cover images from a single prompt.
 *
 * - generateCovers - A function that handles the image generation process.
 * - GenerateCoversInput - The input type for the function.
 * - GenerateCoversOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const GenerateCoversInputSchema = z.object({
  prompt: z.string().describe("A text prompt describing the theme for the card covers."),
});
export type GenerateCoversInput = z.infer<typeof GenerateCoversInputSchema>;

export const GenerateCoversOutputSchema = z.object({
  coverOneDataUri: z.string().describe("The first generated image as a data URI."),
  coverTwoDataUri: z.string().describe("The second generated image as a data URI."),
});
export type GenerateCoversOutput = z.infer<typeof GenerateCoversOutputSchema>;

export async function generateCovers(input: GenerateCoversInput): Promise<GenerateCoversOutput> {
  return generateCoversFlow(input);
}

// Define the generation call as a helper function to call it twice.
async function callImageGenerator(prompt: string): Promise<string> {
   const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        throw new Error('Image generation failed for one of the covers.');
    }
    return media.url;
}


const generateCoversFlow = ai.defineFlow(
  {
    name: 'generateCoversFlow',
    inputSchema: GenerateCoversInputSchema,
    outputSchema: GenerateCoversOutputSchema,
  },
  async ({ prompt }) => {
    
    // Generate two images in parallel
    const [coverOne, coverTwo] = await Promise.all([
        callImageGenerator(prompt),
        callImageGenerator(prompt + " (variant)"), // Add a slight modification to ensure variety
    ]);

    if (!coverOne || !coverTwo) {
      throw new Error('Image generation failed to produce two covers.');
    }

    return {
      coverOneDataUri: coverOne,
      coverTwoDataUri: coverTwo,
    };
  }
);
