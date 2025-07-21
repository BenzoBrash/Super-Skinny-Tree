import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";

const navItems = [
  {
    href: "/dashboard/groups",
    title: "Send Cards to a Group",
    description: "View Groups",
    icon: Users,
  },
  {
    href: "/dashboard/connections",
    title: "Send a Card to Your Branches",
    description: "View Individuals",
    icon: Share2,
  },
];


export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} className="block transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary rounded-lg">
            <Card className="flex flex-col flex-grow h-full">
              <CardHeader className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="font-headline">{item.title}</CardTitle>
                    <CardDescription className="flex items-center text-muted-foreground font-semibold">
                      {item.description}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </CardDescription>
                  </div>
                  <item.icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="text-center pt-8">
        <Link href="/dashboard/gamification" className="text-sm text-gray-400 hover:text-primary underline underline-offset-4">
            Play a game to help your tree grow!
        </Link>
      </div>
    </div>
  )
}
