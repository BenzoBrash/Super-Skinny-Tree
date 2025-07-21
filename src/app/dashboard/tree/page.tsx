
"use client";

import { useState, useEffect, useMemo } from 'react';
import { getMockMembers, type Member } from '@/services/memberService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { GitMerge } from 'lucide-react';
import { TreeGrowthCard } from '@/components/gamification/TreeGrowthCard';
import { calculateTreeHeight, getTreeMilestoneInfo, type UserActivity } from '@/services/treeService';

const ConnectionNode = ({ member, isRoot = false }: { member: Member, isRoot?: boolean }) => {
    return (
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <Avatar className={cn("h-16 w-16 border-4", isRoot ? "border-primary" : "border-muted")}>
                <AvatarImage src={member.profilePhotoUrl} alt={member.fullName} />
                <AvatarFallback>{member.preferredName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold text-center w-20 truncate">{member.fullName}</span>
        </div>
    );
}

export default function VisualTreePage() {
    const [allConnections, setAllConnections] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would fetch live data.
                // We use mock data for this prototype.
                const members = getMockMembers();
                setAllConnections(members);
            } catch (error) {
                console.error("Failed to fetch connections:", error);
                toast({ title: "Error", description: "Could not fetch connection data." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, [toast]);
    
    const { rootNode, firstDegree, secondDegree, thirdDegree, treeMilestoneInfo } = useMemo(() => {
        // Assuming the first 1st degree member is the root for this mock view.
        const root = allConnections.find(c => c.degree === '1st');
        const first = allConnections.filter(c => c.degree === '1st' && c.phone !== root?.phone);
        const second = allConnections.filter(c => c.degree === '2nd');
        const third = allConnections.filter(c => c.degree === '3rd');

        let milestoneInfo = null;
        const member = getMockMembers()[0]; // Using Ben Brashen as the mock user
        if (member) {
             const activity: UserActivity = {
                connections: allConnections.length,
                cardsSent: member.cardsSent ?? 25,
                referrals: member.referrals?.length ?? 5,
                appSpendTotal: 125.50,
                loginStreak: 14,
            };
            const height = calculateTreeHeight(activity);
            milestoneInfo = getTreeMilestoneInfo(height);
        }
        
        return {
            rootNode: root,
            firstDegree: first,
            secondDegree: second,
            thirdDegree: third,
            treeMilestoneInfo: milestoneInfo,
        };
    }, [allConnections]);

    if (isLoading || !treeMilestoneInfo) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="w-full h-[60vh] rounded-lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline flex items-center gap-2"><GitMerge /> Your Connection Tree</h1>
                    <p className="text-muted-foreground">See how your network branches out. Scroll to explore.</p>
                </div>
                <TreeGrowthCard milestoneInfo={treeMilestoneInfo} />
            </div>
            <Card className="w-full h-auto p-4 overflow-hidden">
                 <ScrollArea className="w-full h-[70vh] whitespace-nowrap">
                    <div className="flex flex-col items-center justify-start gap-12 p-8 min-w-max">
                        {/* Root Node (You) */}
                        {rootNode && <ConnectionNode member={rootNode} isRoot />}

                        {/* Connecting line to 1st Degree */}
                        {firstDegree.length > 0 && <div className="w-px h-8 bg-border"></div>}
                        
                        {/* 1st Degree */}
                        <div className="flex justify-center gap-8 relative">
                           {firstDegree.length > 0 && <div className="absolute top-[-2rem] h-px w-full bg-border -z-10"></div>}
                           {firstDegree.map(member => (
                               <div key={member.phone} className="flex flex-col items-center gap-2">
                                  <div className="w-px h-4 bg-border"></div>
                                  <ConnectionNode member={member} />
                               </div>
                           ))}
                        </div>

                         {/* Connecting line to 2nd Degree */}
                        {secondDegree.length > 0 && <div className="w-px h-8 bg-border mt-4"></div>}

                         {/* 2nd Degree */}
                        <div className="flex justify-center gap-8 relative">
                           {secondDegree.length > 0 && <div className="absolute top-[-2rem] h-px w-full bg-border -z-10"></div>}
                           {secondDegree.map(member => (
                                <div key={member.phone} className="flex flex-col items-center gap-2">
                                  <div className="w-px h-4 bg-border"></div>
                                  <ConnectionNode member={member} />
                               </div>
                           ))}
                        </div>

                        {/* Connecting line to 3rd Degree */}
                        {thirdDegree.length > 0 && <div className="w-px h-8 bg-border mt-4"></div>}

                        {/* 3rd Degree */}
                        <div className="flex justify-center gap-8 relative">
                           {thirdDegree.length > 0 && <div className="absolute top-[-2rem] h-px w-full bg-border -z-10"></div>}
                           {thirdDegree.map(member => (
                               <div key={member.phone} className="flex flex-col items-center gap-2">
                                   <div className="w-px h-4 bg-border"></div>
                                   <ConnectionNode member={member} />
                               </div>
                           ))}
                        </div>
                    </div>
                 </ScrollArea>
            </Card>
        </div>
    )
}

    