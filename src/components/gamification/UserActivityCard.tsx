"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PenSquare, Share2 } from "lucide-react";
import type { UserActivity } from "@/services/treeService";
import Link from "next/link";

export const UserActivityCard = ({ activity }: { activity: UserActivity }) => {
    return (
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline">Your Network</CardTitle>
                <CardDescription>A summary of your activity.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                         <Users className="h-6 w-6 text-primary"/>
                        <p className="font-semibold">Connections</p>
                    </div>
                    <p className="font-bold text-lg">{activity.connections}</p>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                     <div className="flex items-center gap-3">
                         <PenSquare className="h-6 w-6 text-primary"/>
                        <p className="font-semibold">Cards Sent</p>
                    </div>
                    <p className="font-bold text-lg">{activity.cardsSent}</p>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                         <Share2 className="h-6 w-6 text-primary"/>
                        <p className="font-semibold">Referrals</p>
                    </div>
                    <p className="font-bold text-lg">{activity.referrals}</p>
                </div>
            </CardContent>
             <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/dashboard/create">Create a New Card</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
