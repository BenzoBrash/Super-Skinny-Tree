
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, PlusCircle, Edit, PenSquare, BookOpen } from "lucide-react";
import { getMockMembers, type Member } from "@/services/memberService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type GroupInfo = {
  name: string;
  members: Member[];
};

const defaultGroupNames = ["Xmas Cards", "Wedding Invitations", "70th Bday Party", "Summer BBQ"];

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Map<string, GroupInfo>>(new Map());
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const members = getMockMembers();
        const groupMap = new Map<string, GroupInfo>(
          defaultGroupNames.map(name => [name, { name, members: [] }])
        );
        
        members.forEach(member => {
          member.groups?.forEach(groupName => {
            const existing = groupMap.get(groupName) || { name: groupName, members: [] };
            existing.members.push(member);
            groupMap.set(groupName, existing);
          });
        });
        setGroups(groupMap);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch group data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [toast]);

  const sortedGroups = useMemo(() => {
    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [groups]);

  const handleProceedToCreate = (group: GroupInfo) => {
    if (group.members.length === 0) {
      toast({ title: "Empty Group", description: "Add members to this group before sending a card.", variant: "destructive" });
      return;
    }
    sessionStorage.setItem('recipients', JSON.stringify(group.members));
    router.push('/dashboard/create');
  }

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast({ title: "Group name cannot be empty.", variant: "destructive" });
      return;
    }
    const trimmedName = newGroupName.trim();
    if (groups.has(trimmedName)) {
      toast({ title: "Group already exists.", description: "Please choose a unique name.", variant: "destructive" });
      return;
    }

    const newGroup = { name: trimmedName, members: [] };
    setGroups(prev => new Map(prev).set(newGroup.name, newGroup));
    toast({ title: "Group Created", description: `"${newGroup.name}" has been created.` });
    setNewGroupName("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">Select a Group</h1>
          <p className="text-muted-foreground">Choose a group to send a card to.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
        ) : (
          <>
            {sortedGroups.map((group) => (
              <Card key={group.name} className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
                <CardContent className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-headline">{group.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Group Name</span>
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {group.members.length} members
                    </span>
                   <Link href={`/dashboard/connections?group=${encodeURIComponent(group.name)}`} className="font-medium text-primary hover:underline">
                      Manage Members
                   </Link>
                  </CardDescription>
                </CardContent>
                 <CardFooter className="flex w-full gap-2 p-3 border-t bg-muted/50">
                      <Button onClick={() => handleProceedToCreate(group)} className="flex-1 h-8 px-2 text-xs">
                         <PenSquare className="mr-1.5 h-3.5 w-3.5" /> AI Designer
                      </Button>
                      <Button onClick={() => handleProceedToCreate(group)} variant="secondary" className="flex-1 h-8 px-2 text-xs">
                         <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Standard Card
                      </Button>
                   </CardFooter>
              </Card>
            ))}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer flex items-center justify-center flex-col min-h-[190px]">
                    <PlusCircle className="h-12 w-12 text-muted-foreground group-hover:text-primary" />
                    <p className="mt-2 font-semibold">Add New Group</p>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateGroup}>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new group to organize your contacts.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="groupName" className="sr-only">Group Name</Label>
                    <Input 
                      id="groupName" 
                      placeholder="e.g., Xmas Card List 2024" 
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Group</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

           {!isLoading && sortedGroups.length === 0 && (
              <div className="text-muted-foreground text-center col-span-full py-8">
                <p>You haven't created any groups yet.</p>
                <p className="text-sm">Click the 'Add' card to create your first group.</p>
              </div>
           )}
          </>
        )}
      </div>
    </div>
  )
}

    