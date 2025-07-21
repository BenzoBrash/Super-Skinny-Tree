"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NotificationRule = {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  target: string;
};

const initialRules: NotificationRule[] = [
  { id: "1", name: "Weekly Birthday Reminder", trigger: "upcoming-birthday", timing: "7-days-before", target: "All Users" },
  { id: "2", name: "Xmas Card Push", trigger: "holiday", timing: "10-days-before", target: "Group: Xmas Cards" },
  { id: "3", name: "Wedding Anniversary", trigger: "anniversary", timing: "3-days-before", target: "All Users" },
];

export default function NotificationsPage() {
  const [rules, setRules] = useState<NotificationRule[]>(initialRules);
  const { toast } = useToast();

  const handleAddRule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRule: NotificationRule = {
      id: (rules.length + 1).toString(),
      name: formData.get("ruleName") as string,
      trigger: formData.get("trigger") as string,
      timing: formData.get("timing") as string,
      target: formData.get("target") as string,
    };

    if (!newRule.name || !newRule.trigger || !newRule.timing || !newRule.target) {
        toast({
            title: "Incomplete Rule",
            description: "Please fill out all fields to create a rule.",
            variant: "destructive"
        });
        return;
    }

    setRules(prev => [...prev, newRule]);
    toast({
        title: "Rule Created",
        description: `Successfully created the "${newRule.name}" rule.`
    });
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Bell />
            Notification Manager
        </h1>
        <p className="text-muted-foreground">Create and manage automated push notifications.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Rule</CardTitle>
              <CardDescription>Set up a new automated notification.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddRule}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input id="ruleName" name="ruleName" placeholder="e.g., Birthday Alerts" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger">Event Trigger</Label>
                  <Select name="trigger">
                    <SelectTrigger id="trigger">
                      <SelectValue placeholder="Select a trigger..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming-birthday">Upcoming Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="inactive-user">Inactive User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timing">Timing</Label>
                  <Select name="timing">
                    <SelectTrigger id="timing">
                      <SelectValue placeholder="Select timing..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day-before">1 Day Before</SelectItem>
                      <SelectItem value="3-days-before">3 Days Before</SelectItem>
                      <SelectItem value="7-days-before">7 Days Before</SelectItem>
                      <SelectItem value="10-days-before">10 Days Before</SelectItem>
                      <SelectItem value="14-days-before">14 Days Before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target Audience</Label>
                  <Select name="target">
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Select an audience..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="Group: Xmas Cards">Group: Xmas Cards</SelectItem>
                      <SelectItem value="Group: Wedding Invitations">Group: Wedding Invitations</SelectItem>
                      <SelectItem value="Group: 70th Bday Party">Group: 70th Bday Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Rule
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Existing Rules</CardTitle>
                    <CardDescription>These rules would be run by a nightly job on the server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Trigger</TableHead>
                                <TableHead>Timing</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell className="font-medium">{rule.name}</TableCell>
                                    <TableCell><Badge variant="outline">{rule.trigger.replace(/-/g, ' ')}</Badge></TableCell>
                                    <TableCell>{rule.timing.replace(/-/g, ' ')}</TableCell>
                                    <TableCell><Badge variant="secondary">{rule.target}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setRules(rules.filter(r => r.id !== rule.id))}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                            <span className="sr-only">Delete Rule</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}