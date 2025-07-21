"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TreePine, Sprout, TrendingUp } from "lucide-react";
import type { TreeMilestoneInfo } from "@/services/treeService";

export const TreeGrowthCard = ({ milestoneInfo }: { milestoneInfo: TreeMilestoneInfo }) => {

    const { currentHeight, progressPercentage, nextMilestone, lastMilestone } = milestoneInfo;

    return (
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Your Tree</CardTitle>
                        <CardDescription>It's grown to new heights!</CardDescription>
                    </div>
                     <TreePine className="h-8 w-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="text-center">
                    <p className="text-4xl font-bold">{currentHeight.toFixed(1)} ft</p>
                    <p className="text-sm text-muted-foreground">Current Height</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{lastMilestone?.title ?? "Sprout"}</span>
                        <span>{nextMilestone?.title ?? "Forest"}</span>
                    </div>
                    <Progress value={progressPercentage} />
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg min-h-[60px]">
                    <p className="text-sm font-semibold text-primary">{nextMilestone?.title ?? "Heart of the Forest"}</p>
                    <p className="text-xs text-muted-foreground">{nextMilestone?.description ?? "Your tree is a beacon in the community."}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" className="w-full">
                    <TrendingUp className="mr-2"/> View Growth History
                </Button>
            </CardFooter>
        </Card>
    );
}
