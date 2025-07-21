
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getMembers, type Member } from '@/services/memberService';
import { useToast } from '@/hooks/use-toast';

export default function DatabasePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true);
            try {
                const membersList = await getMembers();
                setMembers(membersList);
            } catch (error) {
                console.error("Failed to fetch members:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch member data from the database.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, [toast]);

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
                                                    <AvatarFallback>{member.preferredName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{member.fullName}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">{member.phone}</TableCell>
                                            <TableCell>{member.joinDate}</TableCell>
                                             <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {member.groups?.map(group => (
                                                        <Badge key={group} variant="secondary">{group}</Badge>
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
