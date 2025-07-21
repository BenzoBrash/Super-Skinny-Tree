'use server';
/**
 * @fileOverview An AI flow for searching connections.
 *
 * - searchConnections - A function that handles the connection search process.
 */

import {ai} from '@/ai/genkit';
import { SearchConnectionsInput, SearchConnectionsInputSchema, SearchConnectionsOutput, SearchConnectionsOutputSchema } from './search-connections';


export async function searchConnections(input: SearchConnectionsInput): Promise<SearchConnectionsOutput> {
  return searchConnectionsFlow(input);
}

const searchConnectionsFlow = ai.defineFlow(
  {
    name: 'searchConnectionsFlow',
    inputSchema: SearchConnectionsInputSchema,
    outputSchema: SearchConnectionsOutputSchema,
  },
  async (input) => {
    // The AI is no longer needed for this simple search.
    // We will perform a simple text search on name or phone number.
    const queryLower = input.query.toLowerCase();
    const results: SearchConnectionsOutput = { firstDegree: [], secondDegree: [], thirdDegree: [] };
    
    input.connections.forEach(c => {
        const nameMatch = c.name.toLowerCase().includes(queryLower);
        const phoneMatch = c.id.includes(queryLower); // phone is the id

        if (nameMatch || phoneMatch) {
            const searchResultItem = { id: c.id, name: c.name, reason: `Matches '${input.query}'` };
            if (c.degree === '1st') {
                results.firstDegree.push(searchResultItem);
            } else if (c.degree === '2nd') {
                results.secondDegree.push(searchResultItem);
            } else if (c.degree === '3rd') {
                results.thirdDegree.push(searchResultItem);
            }
        }
    });
    return results;
  }
);
