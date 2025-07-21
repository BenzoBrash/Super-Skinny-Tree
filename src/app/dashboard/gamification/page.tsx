"use client";

import { GiftBoxDrop } from "@/components/gamification/GiftBoxDrop";
import { PickADoor } from "@/components/gamification/PickADoor";
import { SunbeamWheelCard } from "@/components/gamification/SunbeamWheelCard";
import { TreeGrowthCard } from "@/components/gamification/TreeGrowthCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { getMockMembers } from "@/services/memberService";
import { calculateTreeHeight, getTreeMilestoneInfo, type UserActivity } from "@/services/treeService";

export default function GamificationPage() {
  // Mocking logged-in user data and activity
  const [isLoading, setIsLoading] = useState(true);
  const [connectionsCount, setConnectionsCount] = useState(0);
  
  const member = getMockMembers()[0]; // Using Ben Brashen as the mock user

  useEffect(() => {
    async function fetchConnections() {
      try {
        const allMembers = await getMockMembers();
        // In a real scenario, this would be scoped to the user's network
        setConnectionsCount(allMembers.length); 
      } catch (error) {
        console.error("Failed to fetch connections count", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchConnections();
  }, []);


  const { userActivity, treeMilestoneInfo } = useMemo(() => {
    if (!member) {
      return { userActivity: null, treeMilestoneInfo: null };
    }

    const activity: UserActivity = {
      connections: connectionsCount,
      cardsSent: member.cardsSent ?? 25,
      referrals: member.referrals?.length ?? 5,
      appSpendTotal: 125.50,
      loginStreak: 14,
    };

    const height = calculateTreeHeight(activity);
    const milestoneInfo = getTreeMilestoneInfo(height);
    
    return { userActivity: activity, treeMilestoneInfo: milestoneInfo };

  }, [member, connectionsCount]);

  if (isLoading || !userActivity || !treeMilestoneInfo) {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-2xl font-bold font-headline">Gamification Showcase</h1>
                <p className="text-muted-foreground">
                Here are some new interactive reward mechanics.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-headline">Gamification Showcase</h1>
        <p className="text-muted-foreground">
          Here are some new interactive reward mechanics.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <TreeGrowthCard milestoneInfo={treeMilestoneInfo} />
        <SunbeamWheelCard treeHeight={treeMilestoneInfo.currentHeight} />
        <GiftBoxDrop />
        <PickADoor />
      </div>
    </div>
  );
}
