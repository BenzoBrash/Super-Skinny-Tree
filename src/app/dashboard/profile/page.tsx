
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
        
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
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
          <div className="lg:col-span-2">
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
                                        You Haven't Sent Anything Yet.... <span className="font-bold text-lg text-primary">Send a card from your Greeting Tree!</span>
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

    