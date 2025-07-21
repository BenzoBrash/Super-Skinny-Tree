/**
 * @fileoverview This file contains the server-side logic for a nightly job
 * that finds upcoming events (like birthdays) and generates personalized
 * push notifications for connected users.
 *
 * This script is intended to be run by a scheduler (e.g., a cron job)
 * in a server environment.
 */
import 'dotenv/config';
import { getMembers, type Member } from '@/services/memberService';
import { generateNotification } from '@/ai/flows/generate-notification-flow';
import { add, format, subMonths } from 'date-fns';

// In a real app, these rules would be fetched from a database (e.g., Firestore).
// For this prototype, we are using a hardcoded list that mirrors the admin UI.
const getNotificationRules = async () => {
  return [
    { id: "1", name: "Weekly Birthday Reminder", trigger: "upcoming-birthday", timing: "7-days-before", target: "All Users" },
    { id: "2", name: "Xmas Card Push", trigger: "holiday", timing: "10-days-before", target: "Group: Xmas Cards" },
    { id: "3", name: "Wedding Anniversary", trigger: "anniversary", timing: "3-days-before", target: "All Users" },
    // A rule specifically for 10 days, as requested.
    { id: "4", name: "Birthday Alert (10-day)", trigger: "upcoming-birthday", timing: "10-days-before", target: "All Users" },
  ];
};


/**
 * The main function for the notification job.
 * It fetches users and rules, checks for upcoming events, generates AI-powered
 * notification text, and logs the payload that would be sent.
 */
export async function runNotificationJob() {
  console.log('Starting nightly notification job...');

  const [allMembers, rules] = await Promise.all([
    getMembers(),
    getNotificationRules(),
  ]);

  const activeMembers = allMembers.filter(m => m.status === 'Active');
  const eventRules = rules.filter(r => r.trigger === 'upcoming-birthday');

  if (eventRules.length === 0) {
    console.log('No birthday/event notification rules found. Exiting job.');
    return;
  }

  console.log(`Found ${activeMembers.length} active members to check.`);

  // A Set to ensure we don't send the same notification twice in one run.
  const sentNotifications = new Set<string>();

  // Iterate over each rule to check for upcoming events
  for (const rule of eventRules) {
    const daysInAdvance = parseInt(rule.timing.split('-')[0], 10);
    if (isNaN(daysInAdvance)) continue;

    const targetDate = add(new Date(), { days: daysInAdvance });
    const targetDateMMDD = format(targetDate, 'MM-dd');

    // Calculate the date for half-birthdays (6 months before the target date)
    const halfBirthdayTarget = subMonths(targetDate, 6);
    const halfBirthdayTargetMMDD = format(halfBirthdayTarget, 'MM-dd');
    
    console.log(`\nChecking for events on ${format(targetDate, 'yyyy-MM-dd')} for rule "${rule.name}"...`);

    // Iterate through every active member to see if it's their event
    for (const eventPerson of activeMembers) {
      if (!eventPerson.birthdate) continue;

      // The birthdate is stored as 'YYYY-MM-DD'. We check against 'MM-DD'.
      const birthDateMMDD = eventPerson.birthdate.substring(5);
      
      let eventType: 'Birthday' | 'Half Birthday' | null = null;
      
      if (birthDateMMDD === targetDateMMDD) {
        eventType = 'Birthday';
      } else if (birthDateMMDD === halfBirthdayTargetMMDD) {
        eventType = 'Half Birthday';
      }

      if (eventType) {
        console.log(`  MATCH: It's ${eventPerson.fullName}'s ${eventType} in ${daysInAdvance} days!`);

        // Now, find who is connected to the event person and should be notified.
        // This is a simplified approach. A real app would have a more complex graph traversal.
        for (const potentialRecipient of activeMembers) {
          // Don't notify the person whose event it is.
          if (potentialRecipient.phone === eventPerson.phone) continue;

          // In this simple model, we assume everyone is connected.
          const isConnected = true; 

          if (isConnected) {
            const notificationKey = `${potentialRecipient.phone}:${eventPerson.phone}:${rule.id}:${eventType}`;
            if (sentNotifications.has(notificationKey)) {
              continue; // Already queued this notification.
            }

            console.log(`    -> Generating notification for ${potentialRecipient.fullName}...`);

            try {
              const notificationContent = await generateNotification({
                connectionName: eventPerson.preferredName || eventPerson.fullName || 'a friend',
                eventName: eventType,
              });

              // In a real system, this payload would be added to a queue (e.g., Pub/Sub)
              // to be processed and sent via a service like FCM at 8 AM Pacific.
              const notificationPayload = {
                recipientId: potentialRecipient.phone,
                recipientPushToken: potentialRecipient.pushToken, // Assumes push token is stored on member record
                ...notificationContent,
              };

              console.log('    ✅ PUSH NOTIFICATION PAYLOAD:');
              console.log(JSON.stringify(notificationPayload, null, 2));

              sentNotifications.add(notificationKey);

            } catch (error) {
              console.error(`    ❌ FAILED to generate notification for ${potentialRecipient.fullName}`, error);
            }
          }
        }
      }
    }
  }

  console.log('\nNotification job finished.');
}

// If this script is run directly, execute the job.
// e.g., `node -r ts-node/register src/server/jobs/send-event-notifications.ts`
if (require.main === module) {
  runNotificationJob().catch(console.error);
}
