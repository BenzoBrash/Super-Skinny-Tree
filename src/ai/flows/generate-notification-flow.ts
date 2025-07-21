'use server';
/**
 * @fileOverview An AI flow for generating personalized notification messages.
 *
 * - generateNotification - A function that creates notification content for events.
 * - GenerateNotificationInput - The input type for the generateNotification function.
 * - GenerateNotificationOutput - The return type for the generateNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const GenerateNotificationInputSchema = z.object({
  connectionName: z.string().describe("The name of the connection the event is about, e.g., 'Jill'."),
  eventName: z.string().describe("The name of the event, e.g., '50th Birthday'."),
});
export type GenerateNotificationInput = z.infer<typeof GenerateNotificationInputSchema>;

export const GenerateNotificationOutputSchema = z.object({
  title: z.string().describe('The short, engaging title for the push notification.'),
  body: z.string().describe('The body of the push notification, which should be friendly and include a call to action.'),
  deepLinkUrl: z.string().url().describe('The deep link URL to open when the notification is tapped.'),
});
export type GenerateNotificationOutput = z.infer<typeof GenerateNotificationOutputSchema>;


export async function generateNotification(input: GenerateNotificationInput): Promise<GenerateNotificationOutput> {
  return generateNotificationFlow(input);
}

const notificationPrompt = ai.definePrompt({
  name: 'generateNotificationPrompt',
  input: {schema: GenerateNotificationInputSchema},
  output: {schema: z.object({
    title: z.string(),
    body: z.string(),
  })},
  prompt: `You are an assistant that writes friendly, engaging push notifications. Your goal is to encourage users to send a card for an upcoming event for one of their connections. The tone should be warm, personal, and concise. The reminder should be for an event that is 10 days away to ensure timely card delivery.

Generate a notification for the following event:

- Connection's Name: {{connectionName}}
- Event: {{eventName}}

Create a short, catchy title and a body that includes the key details and a gentle call to action, like "Want to send a card?". Mention that the event is 10 days away.
`,
});

const generateNotificationFlow = ai.defineFlow(
  {
    name: 'generateNotificationFlow',
    inputSchema: GenerateNotificationInputSchema,
    outputSchema: GenerateNotificationOutputSchema,
  },
  async (input) => {
    const {output} = await notificationPrompt(input);

    if (!output) {
      throw new Error("Failed to generate notification content.");
    }

    const recipient = encodeURIComponent(input.connectionName);
    const occasion = encodeURIComponent(input.eventName);
    
    // The base URL should be your app's domain, but for this context,
    // we are creating the relative path that the client will handle.
    const deepLinkUrl = `/dashboard/create?recipient=${recipient}&occasion=${occasion}`;

    return {
      title: output.title,
      body: output.body,
      deepLinkUrl: deepLinkUrl,
    };
  }
);
