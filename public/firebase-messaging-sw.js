// This file is intentionally left almost empty.
// It's required for Firebase Cloud Messaging to work in the background.

// In a more advanced implementation, you could handle background
// notifications here, but for now, we just need the file to exist.

self.addEventListener('push', (event) => {
  // Optional: Handle background notifications here.
  // For now, we will let the browser display the notification payload directly.
  console.log('[firebase-messaging-sw.js] Received push event: ', event);
});
