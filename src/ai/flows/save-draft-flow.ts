'use server';
/**
 * @fileOverview An AI flow for creating or updating a draft order.
 *
 * - saveOrUpdateDraftOrder - Creates/updates a draft order in Firestore.
 */

import {z} from 'zod';
import {ai} from '@/ai/genkit';
import { createNewOrder, type OrderData } from '@/services/memberService';
import { v4 as uuidv4 } from 'uuid';

export const RecipientSchema = z.object({
  phone: z.string(),
  fullName: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});

export const SaveDraftInputSchema = z.object({
  userId: z.string().describe("The sender's unique ID (phone number)."),
  orderId: z.string().optional().describe("An existing order ID to update. If null, a new one is created."),
  recipients: z.array(RecipientSchema).describe("An array of recipients for the card."),
  card: z.object({
    layout: z.string(),
    borderStyle: z.string(),
    images: z.array(z.object({
      slot: z.number(),
      url: z.string().optional(),
      prompt: z.string().optional(),
    })),
    frontText: z.string(),
    frontFont: z.string(),
    frontColor: z.string(),
    textShadow: z.boolean(),
    textAngle: z.number(),
    backMessage: z.string(),
    backFont: z.string(),
  }),
  orderConfig: z.object({
      cardSize: z.string(),
      finish: z.string(),
      sendCopyToSelf: z.boolean(),
  }),
  totalAmount: z.number().describe("The calculated total cost before tax."),
});
export type SaveDraftInput = z.infer<typeof SaveDraftInputSchema>;

export const SaveDraftOutputSchema = z.object({
  orderId: z.string(),
  success: z.boolean(),
});
export type SaveDraftOutput = z.infer<typeof SaveDraftOutputSchema>;

export async function saveOrUpdateDraftOrder(input: SaveDraftInput): Promise<SaveDraftOutput> {
  return saveDraftFlow(input);
}

const saveDraftFlow = ai.defineFlow(
  {
    name: 'saveDraftFlow',
    inputSchema: SaveDraftInputSchema,
    outputSchema: SaveDraftOutputSchema,
  },
  async (input) => {
    const orderId = input.orderId || uuidv4();

    const orderData: OrderData = {
        userId: input.userId,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        type: 'card',
        totalAmount: input.totalAmount,
        card: input.card,
        orderConfig: input.orderConfig,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: input.recipients.map(r => ({
            recipientUserId: r.phone,
            recipientName: r.fullName,
            recipientAddress: {
              street: r.address.street,
              city: r.address.city,
              state: r.address.state,
              zip: r.address.postalCode,
              country: r.address.country,
            }
        })),
        shipping: {
            method: 'Standard',
            status: 'draft',
            estimatedDeliveryWindow: { start: '', end: '' },
        },
    };
    
    await createNewOrder(orderId, orderData);

    return {
      orderId,
      success: true,
    };
  }
);
