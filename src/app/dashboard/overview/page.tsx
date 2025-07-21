// src/app/dashboard/overview/page.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { getTreeMilestoneInfo, calculateTreeHeight, type UserActivity } from "@/services/treeService";
import { TreeGrowthCard } from "@/components/gamification/TreeGrowthCard";
import { SunbeamWheelCard } from "@/components/gamification/SunbeamWheelCard";
import { UserActivityCard } from "@/components/gamification/UserActivityCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getMockMembers } from "@/services/memberService";
import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function OverviewPage() {
  const { member, loading: authLoading } = useAuth();
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [loadingConnections, setLoadingConnections] = useState(true);

  useEffect(() => {
    async function fetchConnections() {
      try {
        const allMembers = getMockMembers();
        // In a real scenario, this would be scoped to the user's network
        setConnectionsCount(allMembers.length); 
      } catch (error) {
        console.error("Failed to fetch connections count", error);
      } finally {
        setLoadingConnections(false);
      }
    }
    fetchConnections();
  }, []);

  const isLoading = authLoading || loadingConnections;

  const { userActivity, treeMilestoneInfo } = useMemo(() => {
    if (!member) {
      return { userActivity: null, treeMilestoneInfo: null };
    }

    const activity: UserActivity = {
      connections: connectionsCount,
      cardsSent: member.cardsSent ?? 0,
      referrals: member.referrals?.length ?? 0,
      appSpendTotal: 0, // Mock value, replace with real data
      loginStreak: member.loginStreak ?? 0
    };

    const height = calculateTreeHeight(activity);
    const milestoneInfo = getTreeMilestoneInfo(height);
    
    return { userActivity: activity, treeMilestoneInfo: milestoneInfo };

  }, [member, connectionsCount]);
  
  if (isLoading || !member || !userActivity || !treeMilestoneInfo) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold font-headline lg:text-3xl">Welcome Back, {member.preferredName}!</h1>
        <p className="text-muted-foreground">Your forest is flourishing. Here's what's new.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TreeGrowthCard milestoneInfo={treeMilestoneInfo} />
        <SunbeamWheelCard treeHeight={treeMilestoneInfo.currentHeight} />
        <UserActivityCard activity={userActivity} />
      </div>
    </div>
  );
}
