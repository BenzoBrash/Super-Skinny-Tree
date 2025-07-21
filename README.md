
# Branch Out - Project Backup

**This file contains a full backup of your project's source code.**

Due to the persistent "Live branch not found" error with GitHub, this file has been generated to provide you with a reliable, manual way to back up all your work.

**How to Use This Backup:**

1.  **Copy the entire content** of this file.
2.  **On your local computer,** create the folder structure and files exactly as listed below.
3.  **Paste the corresponding code** into each file.

---
---

## File: `apphosting.yaml`

```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
```

---

## File: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## File: `devDependencies.json`

```json
{
  "@types/node-fetch": "^2.6.11"
}
```

---

## File: `firebase.json`

```json
{
  "apphosting": {
    "source": ".",
    "region": "us-central1",
    "predeploy": [
      "npm install",
      "npm run build"
    ]
  }
}
```

---

## File: `.firebaserc`

```json
{
  "projects": {
    "default": "greeting-tree"
  }
}
```

---

## File: `next.config.ts`

```ts
import 'dotenv/config';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

## File: `package.json`

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "postinstall": "patch-package"
  },
  "dependencies": {
    "@genkit-ai/googleai": "^1.13.0",
    "@genkit-ai/next": "^1.13.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "framer-motion": "^11.5.7",
    "genkit": "^1.13.0",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.13.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## File: `src/ai/dev.ts`

```ts
// Flows will be imported for their side effects in this file.
import './flows/search-connections-flow';
import './flows/search-connections';
import './flows/verify-address-flow';
```

---

## File: `src/ai/genkit.ts`

```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

---

## File: `src/ai/flows/search-connections-flow.ts`

```ts
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

const searchPrompt = ai.definePrompt({
    name: 'searchConnectionsPrompt',
    input: { schema: SearchConnectionsInputSchema },
    output: { schema: SearchConnectionsOutputSchema },
    prompt: `You are a connection search assistant. Your task is to find relevant connections from a provided list based on a user's query and search type.

You are provided with a list of all connections across 1st, 2nd, and 3rd degrees. You must return the IDs of the matching connections, categorized by their original degree.

Available Search Types:
- 'name': Perform a simple text search on the connection's name.
- 'school': Perform a simple text search on the connection's school.
- 'lost': Interpret the query to find people who might be "lost connections." This is subjective and could relate to people from a long time ago, or from a specific place mentioned in the query.
- 'old': Interpret the query to find people who might be "old friends." This is similar to 'lost connections' but might imply a closer past relationship.

User Query: "{{query}}"
Search Type: "{{searchType}}"

Connections List:
{{#each connections}}
- ID: {{id}}, Name: {{name}}, School: {{school}}, Degree: {{degree}}
{{/each}}

Please analyze the list and return the IDs of the matching connections in the correct degree category, along with a brief reason for the match. If there are no matches in a degree category, return an empty array for it.
`,
});

const searchConnectionsFlow = ai.defineFlow(
  {
    name: 'searchConnectionsFlow',
    inputSchema: SearchConnectionsInputSchema,
    outputSchema: SearchConnectionsOutputSchema,
  },
  async (input) => {
    // For simple name/school searches, we can do it directly to save AI tokens.
    if (input.searchType === 'name' || input.searchType === 'school') {
        const queryLower = input.query.toLowerCase();
        const results: SearchConnectionsOutput = { firstDegree: [], secondDegree: [], thirdDegree: [] };
        
        input.connections.forEach(c => {
            const fieldToSearch = input.searchType === 'name' ? c.name : c.school;
            if (fieldToSearch?.toLowerCase().includes(queryLower)) {
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
    
    // For complex searches, use the AI prompt
    const { output } = await searchPrompt(input);
    return output!;
  }
);
```

---

## File: `src/ai/flows/search-connections.ts`

```ts
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
  school: z.string().optional().describe("The school the connection attended."),
  degree: z.enum(['1st', '2nd', '3rd']).describe("The degree of connection."),
});

export const SearchConnectionsInputSchema = z.object({
    searchType: z.string().describe("The type of search to perform. Can be 'name', 'school', 'lost', or 'old'."),
    query: z.string().describe("The user's search query."),
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
```

---

## File: `src/ai/flows/verify-address-flow.ts`

```ts
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
```

---

## File: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%; /* White */
    --foreground: 120 25% 15%; /* Dark Green */

    --card: 0 0% 98%; /* Off-white */
    --card-foreground: 120 25% 15%;

    --popover: 0 0% 98%;
    --popover-foreground: 120 25% 15%;

    --primary: 350 70% 45%; /* Festive Red */
    --primary-foreground: 0 0% 98%; /* Off-white */

    --secondary: 120 25% 94%; /* Light Green */
    --secondary-foreground: 120 25% 15%;

    --muted: 120 25% 94%;
    --muted-foreground: 120 25% 40%;

    --accent: 45 80% 50%; /* Gold */
    --accent-foreground: 20 10% 10%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 120 10% 85%;
    --input: 120 10% 85%;
    --ring: 350 70% 45%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 120 25% 15%;
    --sidebar-primary: 350 70% 45%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 120 25% 94%;
    --sidebar-accent-foreground: 120 25% 15%;
    --sidebar-border: 120 10% 85%;
    --sidebar-ring: 350 70% 45%;
  }

  .dark {
    /* A dark holiday theme */
    --background: 120 25% 10%; /* Very Dark Green */
    --foreground: 0 0% 95%; /* Light Gray */

    --card: 120 25% 15%;
    --card-foreground: 0 0% 95%;

    --popover: 120 25% 15%;
    --popover-foreground: 0 0% 95%;

    --primary: 350 70% 55%; /* Brighter Festive Red */
    --primary-foreground: 0 0% 98%;

    --secondary: 120 25% 20%;
    --secondary-foreground: 0 0% 95%;

    --muted: 120 25% 20%;
    --muted-foreground: 0 0% 65%;

    --accent: 45 80% 60%; /* Brighter Gold */
    --accent-foreground: 20 10% 10%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 120 25% 25%;
    --input: 120 25% 25%;
    --ring: 350 70% 55%;

    --sidebar-background: 120 25% 10%;
    --sidebar-foreground: 0 0% 95%;
    --sidebar-primary: 350 70% 55%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 120 25% 20%;
    --sidebar-accent-foreground: 0 0% 95%;
    --sidebar-border: 120 25% 25%;
    --sidebar-ring: 350 70% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
    .wheel-container {
        @apply relative w-80 h-80 rounded-full flex items-center justify-center;
    }
    .wheel {
        @apply absolute w-full h-full rounded-full border-8 border-accent transition-transform ease-out;
        transition-duration: 4000ms;
        background-image: conic-gradient(
            hsl(var(--primary)) 0deg 45deg,
            hsl(var(--secondary)) 45deg 90deg,
            hsl(var(--primary) / 0.8) 90deg 135deg,
            hsl(var(--secondary)) 135deg 180deg,
            hsl(var(--primary)) 180deg 225deg,
            hsl(var(--secondary)) 225deg 270deg,
            hsl(var(--primary) / 0.8) 270deg 315deg,
            hsl(var(--secondary)) 315deg 360deg
        );
    }
    .wheel-segment {
        @apply absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-start pl-4 transform;
    }
    .wheel-pointer {
        @apply absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-foreground z-10;
    }
}
```

---

## File: `src/app/layout.tsx`

```tsx
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Branch Out',
  description: 'Grow your connections.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

---

## File: `src/app/page.tsx`

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TreePine } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <TreePine className="h-6 w-6 text-primary" />
          <span className="sr-only">Branch Out</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link
              href="/onboarding"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/onboarding">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Branch Out and Connect
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create beautiful, custom cards, manage your groups effortlessly, and watch your social circle grow.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/onboarding">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Hero"
                  width={600}
                  height={600}
                  data-ai-hint="greetings card"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Branch Out. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
```

---

## File: `src/app/dashboard/layout.tsx`

```tsx
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarInset, SidebarFooter } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { LogOut, TreePine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
              <TreePine className="h-6 w-6" />
              <span className="group-data-[collapsible=icon]:hidden">Branch Out</span>
            </Link>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start" asChild>
             <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
             </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
             {/* Can add breadcrumbs or page title here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## File: `src/app/dashboard/page.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TreePine, Gift, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold font-headline lg:text-3xl">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's a snapshot of your network.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>My Groups</CardTitle>
            <CardDescription>You are a member of 3 groups.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center justify-center text-muted-foreground space-x-4">
              <Users className="h-16 w-16" />
              <TreePine className="h-16 w-16 text-primary" />
              <Users className="h-16 w-16" />
            </div>
          </CardContent>
          <CardFooter>
             <Button asChild className="w-full">
              <Link href="/dashboard/groups">Manage Groups</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Create & Share</CardTitle>
            <CardDescription>Design a new card or invitation.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <PlusCircle className="h-20 w-20 text-primary/50" />
          </CardContent>
          <CardFooter>
             <Button asChild className="w-full">
              <Link href="/dashboard/create">Create New Card</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>View your order history.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
             <div className="flex items-center justify-center text-muted-foreground space-x-4">
                <Gift className="h-16 w-16 text-accent" />
             </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/profile">View Order History</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
```

---

## File: `src/app/dashboard/connections/page.tsx`

```tsx
// src/app/dashboard/connections/page.tsx
"use client";
export const dynamic = 'force-dynamic';

import ConnectionsPageClient from "./ConnectionsPageClient";

export default function Page() {
  return <ConnectionsPageClient />;
}
```

---

## File: `src/app/dashboard/connections/ConnectionsPageClient.tsx`

```tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Search, UserX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchConnections } from '@/ai/flows/search-connections-flow';
import type { SearchConnectionsOutput } from '@/ai/flows/search-connections';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMockMembers, type Member } from '@/services/memberService';

const ConnectionItem = ({ connection }: { connection: Member }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
            <Checkbox id={`check-${connection.phone}`} aria-label={`Select ${connection.fullName}`} />
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={connection.profilePhotoUrl} alt={connection.fullName} data-ai-hint="person" />
                <AvatarFallback>{connection.preferredName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{connection.fullName}</p>
                <p className="text-sm text-muted-foreground">{connection.school}</p>
            </div>
        </div>
        <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
        </Button>
    </div>
);

const ConnectionList = ({ title, connections }: { title: string, connections: Member[] | undefined }) => {
    if (!connections || connections.length === 0) return null;
    return (
        <div>
            <h2 className="text-lg font-semibold font-headline px-2 my-4">{title}</h2>
            <div className="space-y-1">
                {connections.map((conn) => <ConnectionItem key={conn.phone} connection={conn} />)}
            </div>
        </div>
    )
}

const SearchResultList = ({ title, connections, allConnectionsMap }: { title: string, connections: {id: string, name: string, reason: string}[], allConnectionsMap: Map<string, Member> }) => {
    if (connections.length === 0) return null;
    return (
        <div>
            <h2 className="text-lg font-semibold font-headline px-2 my-4">{title}</h2>
            <div className="space-y-1">
                {connections.map((result) => {
                    const fullConnection = allConnectionsMap.get(result.id);
                    if (!fullConnection) return null;
                    return <ConnectionItem key={result.id} connection={fullConnection} />
                })}
            </div>
        </div>
    )
}


export default function ConnectionsPageClient() {
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchResults, setSearchResults] = useState<SearchConnectionsOutput | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allConnections, setAllConnections] = useState<Member[]>([]);
    
    useEffect(() => {
        const members = getMockMembers();
        setAllConnections(members);
        setIsLoading(false);
    }, []);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            // Map the full Member object to the format expected by the AI flow
            const searchInputConnections = allConnections.map(c => ({
                id: c.phone,
                name: c.fullName,
                school: c.school,
                degree: c.degree,
            }));

            const results = await searchConnections({
                query: searchQuery,
                searchType: searchType,
                connections: searchInputConnections,
            });
            setSearchResults(results);
        } catch (error) {
            console.error("AI search failed:", error);
            // You could add a toast here to inform the user
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery, searchType, allConnections]);
    
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 500); // Debounce search to avoid too many requests

        return () => clearTimeout(debounceTimer);
    }, [handleSearch]);


    const { firstDegree, secondDegree, thirdDegree, allConnectionsMap } = useMemo(() => {
        const first = allConnections.filter(c => c.degree === '1st');
        const second = allConnections.filter(c => c.degree === '2nd');
        const third = allConnections.filter(c => c.degree === '3rd');
        const map = new Map(allConnections.map(c => [c.phone, c]));
        return { firstDegree: first, secondDegree: second, thirdDegree: third, allConnectionsMap: map };
    }, [allConnections]);

    const hasSearchResults = searchResults && (searchResults.firstDegree.length > 0 || searchResults.secondDegree.length > 0 || searchResults.thirdDegree.length > 0);
    const isSearchActive = !!searchQuery.trim();

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-2xl font-bold font-headline">My Connections</h1>
                <p className="text-muted-foreground">Manage your contacts and add them to your groups.</p>
            </div>

            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search connections by name, school, or concept..." 
                                className="pl-10" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <RadioGroup value={searchType} onValueChange={setSearchType} className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="name" id="name" />
                                    <Label htmlFor="name">Name</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="school" id="school" />
                                    <Label htmlFor="school">School</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lost" id="lost" />
                                    <Label htmlFor="lost">Lost Connections</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="old" id="old" />
                                    <Label htmlFor="old">Old Friends</Label>
                                </div>
                            </RadioGroup>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Add to group..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="xmas">Xmas Cards</SelectItem>
                                        <SelectItem value="wedding">Wedding Invitations</SelectItem>
                                        <SelectItem value="bday">70th Bday Party</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="w-full sm:w-auto" disabled={!selectedConnections.length}>Add Selected</Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    <ScrollArea className="flex-1 -mx-6">
                        <div className="px-6">
                        {isLoading || isSearching ? (
                             <div className="mt-4 space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                             </div>
                        ) : isSearchActive ? (
                            hasSearchResults ? (
                                <>
                                    <SearchResultList title="1st Degree Matches" connections={searchResults.firstDegree} allConnectionsMap={allConnectionsMap} />
                                    <SearchResultList title="2nd Degree Matches" connections={searchResults.secondDegree} allConnectionsMap={allConnectionsMap} />
                                    <SearchResultList title="3rd Degree Matches" connections={searchResults.thirdDegree} allConnectionsMap={allConnectionsMap} />
                                </>
                            ) : (
                                <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-4">
                                    <UserX className="w-12 h-12"/>
                                    <p className="font-semibold">No results found for "{searchQuery}"</p>
                                    <p className="text-sm">Try a different search term or type.</p>
                                </div>
                            )
                        ) : (
                            <>
                               <ConnectionList title="1st Degree" connections={firstDegree} />
                               <ConnectionList title="2nd Degree" connections={secondDegree} />
                               <ConnectionList title="3rd Degree" connections={thirdDegree} />
                            </>
                        )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
```

---

## File: `src/app/dashboard/create/page.tsx`

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type CardStyle = 'single-photo' | 'multi-photo';
type FontStyle = 'elegant' | 'modern';

export default function CreateCardPage() {
  const [headline, setHeadline] = useState("You're Invited!");
  const [customHeadline, setCustomHeadline] = useState("");
  const [message, setMessage] = useState("Join us for a holiday celebration...");
  const [photos, setPhotos] = useState<string[]>([]);
  const [cardStyle, setCardStyle] = useState<CardStyle>('single-photo');
  const [backgroundColor, setBackgroundColor] = useState('hsl(var(--card))');
  const [fontStyle, setFontStyle] = useState<FontStyle>('elegant');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPhotos.push(reader.result as string);
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(readFiles => {
        if (cardStyle === 'single-photo') {
          setPhotos(readFiles.slice(0, 1));
        } else {
          setPhotos(currentPhotos => [...currentPhotos, ...readFiles].slice(0, 4));
        }
      });
    }
  };

  const handleHeadlineChange = (value: string) => {
    if (value === 'custom') {
      setHeadline(customHeadline);
    } else {
      setHeadline(value);
      setCustomHeadline('');
    }
  };

  const handleCustomHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHeadline(e.target.value);
    setHeadline(e.target.value);
  }

  const colorPalette = [
    { name: 'White', value: 'hsl(var(--card))' },
    { name: 'Light Green', value: 'hsl(var(--secondary))' },
    { name: 'Festive Red', value: 'hsl(350 70% 96%)' },
    { name: 'Deep Green', value: 'hsl(120 25% 96%)' },
    { name: 'Gold', value: 'hsl(45 80% 96%)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Create a Custom Card</h1>
        <p className="text-muted-foreground">Personalize your invitation or greeting with various styles and options.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Card Style</Label>
              <RadioGroup value={cardStyle} onValueChange={(v) => setCardStyle(v as CardStyle)} className="flex gap-4">
                <Label htmlFor="single-photo" className="flex items-center gap-2 cursor-pointer text-sm">
                  <RadioGroupItem value="single-photo" id="single-photo" />
                  Single Photo
                </Label>
                <Label htmlFor="multi-photo" className="flex items-center gap-2 cursor-pointer text-sm">
                  <RadioGroupItem value="multi-photo" id="multi-photo" />
                  Multi-Photo
                </Label>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="picture">Upload Photo(s)</Label>
               <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                    >
                      <span>Upload file(s)</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" multiple={cardStyle === 'multi-photo'} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">{cardStyle === 'single-photo' ? 'PNG, JPG, up to 10MB' : 'Up to 4 photos'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="headline-select">Headline</Label>
              <Select onValueChange={handleHeadlineChange} defaultValue="You're Invited!">
                <SelectTrigger id="headline-select" className="mt-2">
                  <SelectValue placeholder="Choose a headline..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Happy Holidays!">Happy Holidays!</SelectItem>
                  <SelectItem value="Merry Christmas!">Merry Christmas!</SelectItem>
                  <SelectItem value="You're Invited!">You're Invited!</SelectItem>
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {headline === customHeadline && (
                <Input value={customHeadline} onChange={handleCustomHeadlineChange} placeholder="Type your custom headline" className="mt-2"/>
              )}
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Join us for a holiday celebration..." className="mt-2" rows={4}/>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map(color => (
                   <button key={color.name} title={color.name} onClick={() => setBackgroundColor(color.value)} className={cn("h-8 w-8 rounded-full border-2 transition-all", backgroundColor === color.value ? 'border-primary ring-2 ring-ring' : 'border-muted' )} style={{backgroundColor: color.value}} />
                ))}
              </div>
            </div>

             <div className="space-y-2">
              <Label htmlFor="font-style">Typography</Label>
              <Select onValueChange={(v) => setFontStyle(v as FontStyle)} defaultValue="elegant">
                <SelectTrigger id="font-style">
                  <SelectValue placeholder="Select a font style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Generate Card</Button>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold font-headline">Live Preview</h2>
           <Card 
            className="aspect-[2/3] w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-500 shadow-lg"
            style={{backgroundColor}}
           >
             <div className={cn("relative w-full h-2/3 rounded-t-lg", {
                'grid grid-cols-2 grid-rows-2 gap-1': cardStyle === 'multi-photo' && photos.length > 0,
                'bg-muted': photos.length === 0
             })}>
                {photos.length > 0 ? (
                  cardStyle === 'single-photo' ? (
                    <Image src={photos[0]} alt="Card preview" layout="fill" objectFit="cover" className="rounded-t-lg" />
                  ) : (
                    photos.map((photo, index) => (
                      <div key={index} className="relative w-full h-full">
                        <Image src={photo} alt={`Photo ${index+1}`} layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                    ))
                  )
                ) : (
                   <div className="flex items-center justify-center h-full col-span-2 row-span-2">
                     <Upload className="h-16 w-16 text-muted-foreground/50"/>
                   </div>
                )}
             </div>
             <div className="w-full h-1/3 p-4 text-center flex flex-col justify-center items-center">
                <h3 className={cn("text-2xl text-primary", {
                  'font-headline': fontStyle === 'elegant',
                  'font-sans font-bold': fontStyle === 'modern',
                })}>{headline}</h3>
                <p className={cn("text-sm mt-2", {
                  'font-body': fontStyle === 'elegant',
                  'font-sans': fontStyle === 'modern',
                })}>{message}</p>
             </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
```

---

## File: `src/app/dashboard/database/page.tsx`

```tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getMockMembers, type Member } from '@/services/memberService'; // Updated import

export default function DatabasePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would fetch from Firestore here.
        // For now, we use the mock data service.
        const fetchMembers = async () => {
            setIsLoading(true);
            // Simulating an async fetch
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real scenario:
            // const q = query(collection(db, "members"));
            // const querySnapshot = await getDocs(q);
            // const membersList = querySnapshot.docs.map(doc => ({ ...doc.data() } as Member));
            // setMembers(membersList);
            setMembers(getMockMembers()); // Using mock data
            setIsLoading(false);
        };

        fetchMembers();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Admin CRM View</h1>
                <p className="text-muted-foreground">A holistic view of all data for every member.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>
                        A live view of all entries from the 'members' collection in Firestore.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Avatar</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone (ID)</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Groups</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><div className="flex gap-1"><Skeleton className="h-6 w-[80px] rounded-full" /><Skeleton className="h-6 w-[80px] rounded-full" /></div></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[70px] rounded-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : members.length > 0 ? (
                                    members.map(member => (
                                        <TableRow key={member.phone}>
                                            <TableCell>
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={member.profilePhotoUrl} alt={member.fullName} data-ai-hint="person" />
                                                    <AvatarFallback>{member.preferredName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{member.fullName}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">{member.phone}</TableCell>
                                            <TableCell>{member.joinDate}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {member.groups?.map(group => (
                                                        <Badge key={group} variant="secondary">{group.split('-')[0]}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={member.status === 'Active' ? 'default' : 'destructive'}>
                                                    {member.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No members found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
```

---

## File: `src/app/dashboard/groups/page.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Link as LinkIcon, Users, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const groups = [
  { id: "1", name: "Xmas Cards", members: 78, image: "https://placehold.co/400x300.png", hint: "christmas card" },
  { id: "2", name: "Wedding Invitations", members: 152, image: "https://placehold.co/400x300.png", hint: "wedding invitation" },
  { id: "3", name: "70th Bday Party", members: 45, image: "https://placehold.co/400x300.png", hint: "birthday party" },
];

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">My Groups</h1>
          <p className="text-muted-foreground">Manage your connections and invite others.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
              <Image src={group.image} alt={group.name} width={400} height={300} className="w-full h-auto" data-ai-hint={group.hint} />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline">{group.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-2">
                <Users className="h-4 w-4" />
                <span>{group.members} members</span>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" className="flex-1">
                <LinkIcon className="mr-2 h-4 w-4" />
                Invite Link
              </Button>
              <Button size="sm" variant="outline" aria-label="Show QR Code">
                <QrCode className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## File: `src/app/dashboard/profile/page.tsx`

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gift } from "lucide-react";

const orders = [
    { date: "2024-12-01", recipient: "John Smith", amount: "$5.99", status: "Delivered" },
    { date: "2024-11-15", recipient: "Emily White", amount: "$5.99", status: "Delivered" },
    { date: "2024-10-20", recipient: "The Millers", amount: "$12.50", status: "Delivered" },
]

export default function ProfilePage() {
  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-headline">My Profile</h1>
          <p className="text-muted-foreground">Update your personal information and view your order history.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="items-center text-center">
                 <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="@jane" data-ai-hint="woman smiling"/>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Photo</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Jane Doe" />
                </div>
                 <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                </div>
                 <div>
                  <Label htmlFor="address">Address (obfuscated for others)</Label>
                  <Input id="address" defaultValue="456 Oak Avenue, Springfield, IL 62704" />
                </div>
              </CardContent>
               <CardFooter>
                 <Button className="w-full">Update Profile</Button>
               </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-accent"/>
                        Order History
                    </CardTitle>
                    <CardDescription>A record of all the cards you've sent.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? orders.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.recipient}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        You Haven't Sent Anything Yet.... <span className="font-bold text-lg text-primary">Branch Out</span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}
```

---

## File: `src/app/dashboard/settings/page.tsx`

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and notification preferences.
        </p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to be notified about group activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <Checkbox id="push-notifications" defaultChecked className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                Receive real-time alerts on your device for new invites, address submissions, and important group updates.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="email-notifications" defaultChecked  className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                Get periodic summaries and important alerts delivered to your inbox.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Update Password</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
```

---

## File: `src/app/dashboard/tree/page.tsx`

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DeprecatedTreePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold font-headline mb-4">This page has moved!</h1>
            <p className="text-muted-foreground mb-8">The Invitation Tree is now part of the Connections page.</p>
            <Button asChild>
                <Link href="/dashboard/connections">Go to Connections</Link>
            </Button>
        </div>
    )
}
```

---

## File: `src/app/onboarding/layout.tsx`

```tsx
import { TreePine } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background p-4 sm:p-8">
      <header className="w-full max-w-4xl mx-auto mb-8">
        <Link href="/" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <TreePine className="h-6 w-6" />
            <span>Branch Out</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <footer className="w-full max-w-4xl mx-auto pt-8 text-center text-xs text-muted-foreground">
        &copy; 2024 Branch Out. All rights reserved.
      </footer>
    </div>
  );
}
```

---

## File: `src/app/onboarding/page.tsx`

```tsx
import OnboardingPageClient from "./OnboardingPageClient";

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
    return <OnboardingPageClient />;
}
```

---

## File: `src/app/onboarding/OnboardingPageClient.tsx`

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


const totalSteps = 3;

const StepWelcome = ({ onNext }: { onNext: () => void }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="text-center flex flex-col items-center w-full max-w-2xl"
    >
        <CardTitle className="font-headline text-3xl mb-2">Welcome to Branch Out</CardTitle>
        <p className="text-muted-foreground">Let's get your account set up.</p>
        <Button size="lg" onClick={onNext} className="mt-8">
            Get Started <ArrowRight className="ml-2" />
        </Button>
    </motion.div>
);


const StepAccount = ({ onNext }: { onNext: () => void }) => {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleContinue = () => {
        if (!email.trim() || !password.trim()) {
            toast({
                title: "Fields are required",
                description: "Please enter your email and password.",
                variant: "destructive",
            });
            return;
        }
        onNext();
    };

    return (
     <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-md"
    >
        <CardHeader className="text-center">
            <CardTitle className="font-headline">Create your Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                    id="email" 
                    type="email"
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
             <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input 
                    id="password" 
                    type="password"
                    placeholder="6+ characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
             </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={handleContinue}>Continue</Button>
        </CardFooter>
    </motion.div>
)};


const StepAddress = ({ onNext }: { onNext: () => void }) => {
    const { toast } = useToast();
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setAddress(prev => ({...prev, [id]: value}));
    }

    const handleContinue = () => {
        const { street, city, state, postalCode } = address;
        if (!street || !city || !state || !postalCode) {
             toast({
                title: "Incomplete Address",
                description: "Please fill out all address fields.",
                variant: "destructive",
            });
            return;
        }
        // No AI verification, just proceed
        onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md"
        >
            <CardHeader className="text-center">
                <CardTitle className="font-headline">Where can you receive cards?</CardTitle>
                <CardDescription>Your address is never shared publicly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" placeholder="123 Main St" value={address.street} onChange={handleInputChange} autoComplete="street-address" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" value={address.city} onChange={handleInputChange} autoComplete="address-level2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="CA" value={address.state} onChange={handleInputChange} autoComplete="address-level1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Zip Code</Label>
                        <Input id="postalCode" placeholder="12345" value={address.postalCode} onChange={handleInputChange} autoComplete="postal-code" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleContinue}>
                    Create Account
                </Button>
            </CardFooter>
        </motion.div>
    );
};


const StepFinish = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-2xl text-center"
    >
        <CardTitle className="font-headline text-3xl mb-2">Account Created!</CardTitle>
        <p className="text-muted-foreground">Welcome to the grove. Let's start connecting.</p>
        <Button size="lg" asChild className="mt-8">
             <Link href="/dashboard" prefetch>
                Go to My Dashboard
            </Link>
        </Button>
    </motion.div>
);


export default function OnboardingPageClient() {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
    };

    const progressValue = (step / totalSteps) * 100;

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepAccount onNext={handleNext} />;
            case 2:
                return <StepAddress onNext={handleNext} />;
            case 3:
                return <StepFinish />;
            default:
                return <StepWelcome onNext={handleNext} />;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {step <= totalSteps && <Progress value={progressValue} className="w-full h-2 mb-8" />}
            <Card className="w-full bg-card/80 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center p-4 sm:p-8 min-h-[500px]"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    );
}
```

---

## File: `src/components/main-nav.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, User, Settings, LayoutDashboard, PenSquare, Share2, Database } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/groups", label: "Groups", icon: Users },
  { href: "/dashboard/connections", label: "Connections", icon: Share2 },
  { href: "/dashboard/create", label: "Create Card", icon: PenSquare },
  { href: "/dashboard/database", label: "Database", icon: Database },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col", className)} {...props}>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{children: item.label, side: "right", align:"center"}}
            >
              <Link href={item.href}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
```

---

## File: `src/components/user-nav.tsx`

```tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut, User, Settings, Users } from "lucide-react";


export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/100x100.png" alt="@jane" data-ai-hint="woman smiling" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-headline">Jane Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              jane.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile"><User className="mr-2 h-4 w-4"/>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/groups"><Users className="mr-2 h-4 w-4"/>Groups</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4"/>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/"><LogOut className="mr-2 h-4 w-4"/>Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## File: `src/hooks/use-mobile.tsx`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

---

## File: `src/hooks/use-toast.ts`

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---

## File: `src/lib/firebase.ts`

```ts
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let auth: ReturnType<typeof getAuth> | null = null;
let db;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  ) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase configuration is missing. Please check your .env file.");
    app = null;
    auth = null;
    db = null;
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  app = null;
  auth = null;
  db = null;
}

export { app, auth, db };
```

---

## File: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## File: `src/services/memberService.ts`

```ts
// src/services/memberService.ts

export type Member = {
  phone: string;                   // Unique user ID (E.164)
  fullName: string;
  preferredName: string;
  degree: '1st' | '2nd' | '3rd';
  profilePhotoUrl?: string;
  school?: string;
  email?: string;
  birthdate?: string;
  gender?: string;
  tShirtSize?: string;
  favoriteColor?: string;
  favoriteHoliday?: string;
  anniversaryDates?: { type: string; date: string }[];
  interests?: string[];
  referralCode?: string;
  referrer?: string;
  referrals?: string[];
  cardsSent?: number;
  cardsReceived?: number;
  badges?: string[];
  groups?: string[];
  interestScore?: number;
  pushNotificationsEnabled?: boolean;
  pushToken?: string;
  onboardingCompleted?: boolean;
  joinDate: string;
  lastActive?: string;
  reasonForJoining?: string;
  intent?: string;
  journeyStatus?: string;
  savedPayments?: { provider: string; token: string }[];
  subscription?: { active: boolean; type: string };
  gdprConsentDate?: string;
  tosAcceptedDate?: string;
  status: "Active" | "Inactive" | "Suspended";
  timeInApp?: number;
  lastSessionStart?: string;
  lastSessionEnd?: string;
  activityTrends?: {
    sentPerDay?: Record<string, number>;
  };
};

export type Order = {
  orderId: string;
  userId: string; // Sender's phone number
  orderDate: string;
  status: 'processing' | 'shipped' | 'delivered' | 'draft';
  type: string;
  totalAmount: number;
  shipping: {
    method: string;
    status: string;
    trackingNumber?: string;
    estimatedDeliveryWindow: {
        start: string; // e.g. "2024-12-20"
        end: string;   // e.g. "2024-12-24"
    }
  };
  card: {
      headline: string;
      message: string;
  };
  createdAt: string;
  updatedAt: string;
  items: {
    recipientUserId: string; // Recipient's phone number
    recipientName: string;
    recipientAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  }[];
};

/**
 * Fallback loader for mock member data.
 * This is not async, it returns the mock data directly.
 */
export function getMockMembers(): Member[] {
  return [
    {
      phone: "+12065551234",
      fullName: "Ben Brashen",
      preferredName: "Ben",
      degree: "1st", // Root user for this mock
      profilePhotoUrl: "https://placehold.co/100x100.png",
      email: "bennybrashen@gmail.com",
      joinDate: "2025-07-18",
      status: "Active",
      groups: ["family-12065551234", "work-abc987"],
      referrals: ["+12068887777"],
      school: "University of Washington"
    },
    {
      phone: "+12068887777",
      fullName: "Alice Smith",
      preferredName: "Alice",
      degree: "1st",
      profilePhotoUrl: "https://placehold.co/100x100.png",
      email: "alice.smith@example.com",
      joinDate: "2025-07-19",
      status: "Active",
      groups: ["family-12065551234"],
      referrer: "+12065551234", // Referred by Ben
      referrals: ["+14155550000"],
      school: "Stanford University"
    },
    {
      phone: "+14155550000",
      fullName: "Charlie Brown",
      preferredName: "Charlie",
      degree: "2nd",
      profilePhotoUrl: "https://placehold.co/100x100.png",
      email: "charlie.b@example.com",
      joinDate: "2025-06-10",
      status: "Inactive",
      groups: ["work-abc987"],
      referrer: "+12068887777", // Referred by Alice
      school: "University of California, Berkeley"
    },
    {
        phone: "+13125559876",
        fullName: "Diana Prince",
        preferredName: "Diana",
        degree: "3rd",
        profilePhotoUrl: "https://placehold.co/100x100.png",
        email: "diana.prince@themyscira.com",
        joinDate: "2024-01-01",
        status: "Active",
        groups: ["justice-league", "work-abc987"],
        cardsSent: 50,
        cardsReceived: 20,
        referrer: "+14155550000", // Referred by Charlie
        school: "Themyscira University"
    }
  ];
}

export function getMockOrders(): Order[] {
    return [
        {
            orderId: 'ord_123',
            userId: '+12065551234',
            orderDate: '2024-07-15',
            status: 'delivered',
            type: 'card',
            totalAmount: 5.99,
            shipping: { method: 'Standard', status: 'delivered', estimatedDeliveryWindow: { start: '2024-07-20', end: '2024-07-24' } },
            card: { headline: "Happy Birthday!", message: "Hope you have a great one!" },
            createdAt: '2024-07-15T10:00:00Z',
            updatedAt: '2024-07-20T12:00:00Z',
            items: [{ recipientUserId: '+12068887777', recipientName: 'Alice Smith', recipientAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' } }]
        },
        {
            orderId: 'ord_456',
            userId: '+12065551234',
            orderDate: '2024-07-18',
            status: 'draft',
            type: 'card',
            totalAmount: 0.00,
            shipping: { method: 'Standard', status: 'draft', estimatedDeliveryWindow: { start: '', end: '' } },
            card: { headline: "Thinking of You", message: "Just wanted to say hi!" },
            createdAt: '2024-07-18T11:00:00Z',
            updatedAt: '2024-07-18T11:00:00Z',
            items: [{ recipientUserId: '+14155550000', recipientName: 'Charlie Brown', recipientAddress: { street: '456 Oak Ave', city: 'Someplace', state: 'NY', zip: '67890' } }]
        }
    ];
}
```

---

## File: `tailwind.config.ts`

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Alegreya', 'serif'],
        headline: ['Belleza', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

## File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---
*Note: The UI components in `src/components/ui` are standard ShadCN components and have been excluded for brevity. They can be re-added to a new project using the ShadCN CLI.*
