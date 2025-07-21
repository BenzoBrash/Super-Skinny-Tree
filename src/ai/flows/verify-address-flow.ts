
'use server';
/**
 * @fileOverview An AI flow for verifying and standardizing postal addresses.
 *
 * - verifyAddress - A function that handles the address verification process.
 * - VerifyAddressInput - The input type for the verifyAddress function.
 * - VerifyAddressOutput - The return type for the verifyAddress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const VerifyAddressInputSchema = z.object({
  street: z.string().describe('The street address, including apartment or suite number.'),
  city: z.string().describe('The city or town.'),
  state: z.string().describe('The state, province, or region.'),
  postalCode: z.string().describe('The postal code or ZIP code.'),
  country: z.string().default('USA').describe('The country.'),
});
export type VerifyAddressInput = z.infer<typeof VerifyAddressInputSchema>;

export const VerifyAddressOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the address appears to be valid and deliverable.'),
  reason: z.string().optional().describe('The reason why the address is considered invalid, if applicable.'),
  standardizedAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional().describe('The standardized version of the address, if valid.'),
});
export type VerifyAddressOutput = z.infer<typeof VerifyAddressOutputSchema>;

export async function verifyAddress(input: VerifyAddressInput): Promise<VerifyAddressOutput> {
  return verifyAddressFlow(input);
}

const verifyPrompt = ai.definePrompt({
  name: 'verifyAddressPrompt',
  input: {schema: VerifyAddressInputSchema},
  output: {schema: VerifyAddressOutputSchema},
  prompt: `You are an expert address verification and standardization service. Your task is to analyze the provided address components and determine if it is a plausible, deliverable postal address.

Address to verify:
Street: {{street}}
City: {{city}}
State: {{state}}
Postal Code: {{postalCode}}
Country: {{country}}

1.  **Analyze and Standardize**: Examine the address. If it's clearly a valid address with minor formatting issues (e.g., "Street" instead of "St.", full state name instead of code), correct and standardize it.
2.  **Check for Plausibility**: Determine if the combination of city, state, and postal code is plausible. Check for obviously fake information (e.g., "123 Fake St, Anytown, ZZ 99999").
3.  **Output**:
    *   If the address seems valid and you are confident, set \`isValid\` to \`true\` and populate the \`standardizedAddress\` object with the corrected and standardized components.
    *   If the address is plausible but you are not 100% certain (e.g., the street number might not exist but the street/city/state/zip combo is valid), **still set \`isValid\` to \`true\`**, but provide a user-friendly \`reason\` like "We couldn't confirm the exact street number, but the rest of the address looks correct." Also provide the standardized address.
    *   If the address is clearly invalid or nonsensical (e.g., postal code doesn't match city/state), set \`isValid\` to \`false\` and provide a brief, user-friendly explanation in the \`reason\` field (e.g., "The postal code does not seem to match the city and state."). Do not provide a standardized address.
`,
});

const verifyAddressFlow = ai.defineFlow(
  {
    name: 'verifyAddressFlow',
    inputSchema: VerifyAddressInputSchema,
    outputSchema: VerifyAddressOutputSchema,
  },
  async (input) => {
    const {output} = await verifyPrompt(input);
    return output!;
  }
);

