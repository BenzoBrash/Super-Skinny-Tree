
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Search, UserX, GitBranch, GitPullRequest, GitMerge, Check as CheckIcon, PenSquare, BookOpen } from 'lucide-react';
import { searchConnections } from '@/ai/flows/search-connections-flow';
import type { SearchConnectionsOutput } from '@/ai/flows/search-connections';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMockMembers, type Member } from '@/services/memberService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

export type ConnectionStatus = 'Branched' | 'Hanging Branch' | 'Branched Out';

const statusDescriptions: Record<ConnectionStatus, string> = {
    'Branched': "You and this person have mutually connected.",
    'Hanging Branch': "This person has connected with you, but you haven't connected back yet.",
    'Branched Out': "You've sent an invite, but they haven't connected back yet."
};

interface Connection extends Member {
    status: ConnectionStatus;
}

const ConnectionItem = ({ connection, onBranchBack, onSelectionChange, isSelected }: { connection: Connection, onBranchBack: (phone: string) => void, onSelectionChange: (phone: string, selected: boolean) => void, isSelected: boolean }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
            <Checkbox 
              id={`check-${connection.phone}`} 
              aria-label={`Select ${connection.fullName}`} 
              onCheckedChange={(checked) => onSelectionChange(connection.phone, !!checked)}
              checked={isSelected}
            />
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={connection.profilePhotoUrl} alt={connection.fullName} data-ai-hint="person" />
                <AvatarFallback>{connection.preferredName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{connection.fullName}</p>
                <p className="text-sm text-muted-foreground">
                    {connection.address ? connection.address.state : 'Location not listed'}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                            {connection.status === 'Branched' && <GitMerge className="h-4 w-4 text-green-600" />}
                            {connection.status === 'Hanging Branch' && <GitPullRequest className="h-4 w-4 text-orange-500" />}
                            {connection.status === 'Branched Out' && <GitBranch className="h-4 w-4 text-blue-500" />}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{statusDescriptions[connection.status]}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {connection.status === 'Hanging Branch' && (
                <Button size="sm" onClick={() => onBranchBack(connection.phone)}>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Branch Back
                </Button>
            )}
        </div>
    </div>
);

const ConnectionList = ({ title, connections, onBranchBack, onSelectionChange, selectedConnections }: { title: string, connections: Connection[] | undefined, onBranchBack: (phone: string) => void, onSelectionChange: (phone: string, selected: boolean) => void, selectedConnections: Set<string> }) => {
    if (!connections || connections.length === 0) return null;
    return (
        <div>
            <h2 className="text-lg font-semibold font-headline px-2 my-4">{title}</h2>
            <div className="space-y-1">
                {connections.map((conn) => <ConnectionItem key={conn.phone} connection={conn} onBranchBack={onBranchBack} onSelectionChange={onSelectionChange} isSelected={selectedConnections.has(conn.phone)} />)}
            </div>
        </div>
    )
}

const SearchResultList = ({ title, connections, allConnectionsMap, onBranchBack, onSelectionChange, selectedConnections }: { title: string, connections: {id: string, name: string, reason: string}[], allConnectionsMap: Map<string, Connection>, onBranchBack: (phone: string) => void, onSelectionChange: (phone: string, selected: boolean) => void, selectedConnections: Set<string> }) => {
    if (connections.length === 0) return null;
    return (
        <div>
            <h2 className="text-lg font-semibold font-headline px-2 my-4">{title}</h2>
            <div className="space-y-1">
                {connections.map((result) => {
                    const fullConnection = allConnectionsMap.get(result.id);
                    if (!fullConnection) return null;
                    return <ConnectionItem key={result.id} connection={fullConnection} onBranchBack={onBranchBack} onSelectionChange={onSelectionChange} isSelected={selectedConnections.has(fullConnection.phone)} />
                })}
            </div>
        </div>
    )
}


export default function ConnectionsPageClient() {
    const router = useRouter();
    const [selectedConnections, setSelectedConnections] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchConnectionsOutput | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allConnections, setAllConnections] = useState<Connection[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | ConnectionStatus>('all');
    
    useEffect(() => {
        const members = getMockMembers();
        const membersWithStatus = members.map((member, index): Connection => {
            const mod = index % 3; // Use 3 states
            let status: ConnectionStatus;
            if (mod === 0) status = 'Branched';
            else if (mod === 1) status = 'Hanging Branch';
            else status = 'Branched Out';
            return {...member, status};
        });
        setAllConnections(membersWithStatus);
        setIsLoading(false);
    }, []);

    const handleProceedToCreate = () => {
        const selectedMembers = allConnections.filter(c => selectedConnections.has(c.phone));
        // Store recipients in sessionStorage to pass to the next page
        if (selectedMembers.length > 0) {
            sessionStorage.setItem('recipients', JSON.stringify(selectedMembers));
        } else {
            sessionStorage.removeItem('recipients');
        }
        router.push('/dashboard/create');
    }

    const handleSelectionChange = (phone: string, selected: boolean) => {
        setSelectedConnections(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(phone);
            } else {
                newSet.delete(phone);
            }
            return newSet;
        });
    };

    const handleBranchBack = (phone: string) => {
        setAllConnections(prev => 
            prev.map(c => c.phone === phone ? { ...c, status: 'Branched' } : c)
        );
    };

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const searchInputConnections = allConnections.map(c => ({
                id: c.phone,
                name: c.fullName,
                degree: c.degree,
            }));

            const results = await searchConnections({
                query: searchQuery,
                connections: searchInputConnections,
            });
            setSearchResults(results);
        } catch (error) {
            console.error("AI search failed:", error);
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery, allConnections]);
    
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [handleSearch]);


    const { firstDegree, secondDegree, thirdDegree, allConnectionsMap } = useMemo(() => {
        const filtered = statusFilter === 'all' 
            ? allConnections 
            : allConnections.filter(c => c.status === statusFilter);

        const first = filtered.filter(c => c.degree === '1st');
        const second = filtered.filter(c => c.degree === '2nd');
        const third = filtered.filter(c => c.degree === '3rd');
        const map = new Map(allConnections.map(c => [c.phone, c]));
        
        return { firstDegree: first, secondDegree: second, thirdDegree: third, allConnectionsMap: map };
    }, [allConnections, statusFilter]);

    const hasSearchResults = searchResults && (searchResults.firstDegree.length > 0 || searchResults.secondDegree.length > 0 || searchResults.thirdDegree.length > 0);
    const isSearchActive = !!searchQuery.trim();

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="text-center">
                <h1 className="text-2xl font-bold font-headline text-black">Select Individuals</h1>
                <p className="text-muted-foreground">Who are you sending cards to today?</p>
            </div>

            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or cell..." 
                                className="pl-10" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                         <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                            <div className="flex-1">
                                <Label className="text-sm font-medium">Filter by Status</Label>
                                <RadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <Label htmlFor="all">All</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Branched" id="Branched" />
                                        <Label htmlFor="Branched">Branched</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Hanging Branch" id="Hanging Branch" />
                                        <Label htmlFor="Hanging Branch">Hanging</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Branched Out" id="Branched Out" />
                                        <Label htmlFor="Branched Out">Pending</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="w-full sm:w-auto space-y-2">
                                <Button className="w-full" onClick={handleProceedToCreate}>
                                    <PenSquare className="mr-2"/> Design your card with AI or Photos
                                </Button>
                                <Button variant="secondary" className="w-full" onClick={handleProceedToCreate}>
                                    <BookOpen className="mr-2"/> Send a Standard Greeting Card
                                </Button>
                            </div>
                        </div>

                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    <div className="border-t -mx-6 my-4"></div>
                     <p className="text-sm font-medium px-1 mb-2">{selectedConnections.size} selected</p>
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
                                    <SearchResultList title="1st Degree Matches" connections={searchResults.firstDegree} allConnectionsMap={allConnectionsMap} onBranchBack={handleBranchBack} onSelectionChange={handleSelectionChange} selectedConnections={selectedConnections} />
                                    <SearchResultList title="2nd Degree Matches" connections={searchResults.secondDegree} allConnectionsMap={allConnectionsMap} onBranchBack={handleBranchBack} onSelectionChange={handleSelectionChange} selectedConnections={selectedConnections} />
                                    <SearchResultList title="3rd Degree Matches" connections={searchResults.thirdDegree} allConnectionsMap={allConnectionsMap} onBranchBack={handleBranchBack} onSelectionChange={handleSelectionChange} selectedConnections={selectedConnections} />
                                </>
                            ) : (
                                <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-4">
                                    <UserX className="w-12 h-12"/>
                                    <p className="font-semibold">No results found for "{searchQuery}"</p>
                                    <p className="text-sm">Try a different name or phone number.</p>
                                </div>
                            )
                        ) : (
                            <>
                               <ConnectionList title="1st Degree" connections={firstDegree} onBranchBack={handleBranchBack} onSelectionChange={handleSelectionChange} selectedConnections={selectedConnections}/>
                               <ConnectionList title="2nd Degree" connections={secondDegree} onBranchBack={handleBranchBack} onSelectionChange={handleSelectionChange} selectedConnections={selectedConnections}/>
                               <ConnectionList title="3rd Degree" connections={thirdDegree} onBranchBack={handleBranchBack} onSelectionChange={handleSelectionChange} selectedConnections={selectedConnections}/>
                            </>
                        )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
