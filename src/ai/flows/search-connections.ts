/**
 * @fileOverview Schemas and types for the connection search AI flow.
 *
 * - SearchConnectionsInput - The input type for the searchConnections function.
 * - SearchConnectionsOutput - The return type for the searchConnections function.
 */

import {z} from 'zod';

const ConnectionSchema = z.object({
  id: z.string().describe("The connection's unique ID, which is their phone number."),
  name: z.string().describe("The connection's full name."),
  degree: z.enum(['1st', '2nd', '3rd']).describe("The degree of connection."),
});

export const SearchConnectionsInputSchema = z.object({
    query: z.string().describe("The user's search query (name or phone number)."),
    connections: z.array(ConnectionSchema).describe("The list of all connections to search through."),
});
export type SearchConnectionsInput = z.infer<typeof SearchConnectionsInputSchema>;

const SearchResultItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    reason: z.string().describe("A brief explanation of why this connection matches the search criteria.")
});

export const SearchConnectionsOutputSchema = z.object({
    firstDegree: z.array(SearchResultItemSchema),
    secondDegree: z.array(SearchResultItemSchema),
    thirdDegree: z.array(SearchResultItemSchema),
});
export type SearchConnectionsOutput = z.infer<typeof SearchConnectionsOutputSchema>;
