"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { updateMemberPushSettings } from "@/services/memberService";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "@/lib/firebase";

export default function SettingsPage() {
  const { user, member } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
        setPushNotifications(member.pushNotificationsEnabled ?? true);
        setEmailNotifications(member.emailNotificationsEnabled ?? true);
    }
  }, [member]);

  const handlePushChange = async (enabled: boolean) => {
    setPushNotifications(enabled);

    if (enabled && app) {
      try {
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();
        
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // Get the token
          const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            // Save this token to the user's profile
            await updateMemberPushSettings(member?.phone!, { 
                pushEnabled: true, 
                emailEnabled: emailNotifications, 
                token: currentToken 
            });
            toast({ title: "Push Notifications Enabled" });
          } else {
            console.log('No registration token available. Request permission to generate one.');
            toast({ title: "Could not get push token", description: "Please try again.", variant: "destructive" });
          }
        } else {
          console.log("Unable to get permission to notify.");
          setPushNotifications(false); // Revert if permission denied
          toast({ title: "Permission Denied", description: "You have disabled push notifications.", variant: "destructive" });
        }
      } catch (error) {
        console.error('An error occurred while getting token. ', error);
        toast({ title: "Error", description: "Could not enable push notifications.", variant: "destructive" });
        setPushNotifications(false); // Revert on error
      }
    } else {
        // User is disabling push notifications
        await updateMemberPushSettings(member?.phone!, { pushEnabled: false, emailEnabled: emailNotifications, token: null });
        toast({ title: "Push Notifications Disabled" });
    }
  }


  const handleSaveChanges = async () => {
    if (!user || !member) {
        toast({ title: "Error", description: "You must be logged in to save settings.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    try {
      // The push token is handled by its own change handler, so we only save email settings here.
      await updateMemberPushSettings(member.phone, { pushEnabled: pushNotifications, emailEnabled: emailNotifications });
      
      toast({
        title: "Preferences Saved",
        description: "Your notification settings have been updated.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Could not save your preferences. Please try again.",
        variant: "destructive"
      })
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and notification preferences.
        </p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to be notified about group activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="push-notifications" 
                checked={pushNotifications}
                onCheckedChange={(checked) => handlePushChange(!!checked)}
                className="mt-1" 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                Receive real-time alerts on your device for new invites, address submissions, and important group updates.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={(checked) => setEmailNotifications(!!checked)}
                className="mt-1" 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                Get periodic summaries and important alerts delivered to your inbox.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveChanges} disabled={isLoading || !member}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Email Preferences
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Update Password</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}