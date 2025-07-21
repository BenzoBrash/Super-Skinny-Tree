// src/services/memberService.ts
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export type Member = {
  phone: string; // Unique user ID (E.164)
  uid?: string; // Firebase Auth UID
  fullName: string;
  preferredName: string;
  degree: '1st' | '2nd' | '3rd';
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    obfuscated?: string;
  };
  profilePhotoUrl?: string;
  school?: string;
  email?: string;
  emailNotificationsEnabled?: boolean;
  birthdate?: string;
  gender?: string;
  tShirtSize?: string;
  favoriteColor?: string;
  favoriteHoliday?: string;
  anniversaryDates?: { type: string; date: string }[];
  interests?: string[];
  referralCode?: string;
  referrer?: string;
  referrals?: string[];
  cardsSent?: number;
  cardsReceived?: number;
  appSpendTotal?: number;
  loginStreak?: number;
  badges?: string[];
  groups?: string[];
  interestScore?: number;
  pushNotificationsEnabled?: boolean;
  pushToken?: string | null;
  onboardingCompleted?: boolean;
  joinDate: string;
  lastActive?: string;
  reasonForJoining?: string;
  intent?: string;
  journeyStatus?: string;
  savedPayments?: { provider: string; token: string }[];
  subscription?: { active: boolean; type: string };
  gdprConsentDate?: string;
  tosAcceptedDate?: string;
  status: "Active" | "Inactive" | "Suspended";
  timeInApp?: number;
  lastSessionStart?: string;
  lastSessionEnd?: string;
  activityTrends?: {
    sentPerDay?: Record<string, number>;
  };
};

export type OrderData = {
    userId: string;
    orderDate: string;
    status: 'processing' | 'shipped' | 'delivered' | 'draft';
    type: string;
    totalAmount: number;
    shipping: {
        method: string;
        status: string;
        trackingNumber?: string;
        estimatedDeliveryWindow: {
            start: string;
            end: string;
        }
    };
    card: any; // Storing the full card design object
    orderConfig: any; // Storing size, finish, etc.
    createdAt: string;
    updatedAt: string;
    items: {
        recipientUserId: string;
        recipientName: string;
        recipientAddress: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
    }[];
}


export type Order = OrderData & { orderId: string };


/**
 * Creates a new order document in Firestore.
 * @param orderId The unique ID for the order.
 * @param data The order data to save.
 */
export async function createNewOrder(orderId: string, data: OrderData): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized.");
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, data);
}

/**
 * Fetches an order by its ID from Firestore.
 * @param orderId The ID of the order to fetch.
 * @returns The order data or null if not found.
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
    if (!db) throw new Error("Firestore is not initialized.");
    const orderRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(orderRef);
    if (docSnap.exists()) {
        return { orderId: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
}

/**
 * Fallback loader for mock member data.
 * This is not async, it returns the mock data directly.
 */
export function getMockMembers(): Member[] {
  return [
    {
      phone: "+12065551234",
      fullName: "Ben Brashen",
      preferredName: "Ben",
      degree: "1st", // Root user for this mock
      profilePhotoUrl: "https://placehold.co/100x100.png",
      email: "bennybrashen@gmail.com",
      joinDate: "2025-07-18",
      status: "Active",
      groups: ["family-12065551234", "work-abc987", "Xmas Cards"],
      referrals: ["+12068887777"],
      school: "University of Washington",
      address: { street: "123 Main St", city: "Seattle", state: "WA", postalCode: "98101", country: "USA"}
    },
    {
      phone: "+12068887777",
      fullName: "Alice Smith",
      preferredName: "Alice",
      degree: "1st",
      profilePhotoUrl: "https://placehold.co/100x100.png",
      email: "alice.smith@example.com",
      joinDate: "2025-07-19",
      status: "Active",
      groups: ["family-12065551234", "Xmas Cards"],
      referrer: "+12065551234", // Referred by Ben
      referrals: ["+14155550000"],
      school: "Stanford University",
      address: { street: "456 Oak Ave", city: "Palo Alto", state: "CA", postalCode: "94301", country: "USA"}
    },
    {
      phone: "+14155550000",
      fullName: "Charlie Brown",
      preferredName: "Charlie",
      degree: "2nd",
      profilePhotoUrl: "https://placehold.co/100x100.png",
      email: "charlie.b@example.com",
      joinDate: "2025-06-10",
      status: "Inactive",
      groups: ["work-abc987"],
      referrer: "+12068887777", // Referred by Alice
      school: "University of California, Berkeley",
      address: { street: "789 Pine St", city: "Berkeley", state: "CA", postalCode: "94720", country: "USA"}
    },
    {
        phone: "+13125559876",
        fullName: "Diana Prince",
        preferredName: "Diana",
        degree: "3rd",
        profilePhotoUrl: "https://placehold.co/100x100.png",
        email: "diana.prince@themyscira.com",
        joinDate: "2024-01-01",
        status: "Active",
        groups: ["justice-league", "work-abc987", "Wedding Invitations"],
        cardsSent: 50,
        cardsReceived: 20,
        referrer: "+14155550000", // Referred by Charlie
        school: "Themyscira University",
        address: { street: "1 Paradise Island", city: "Themyscira", state: "DC", postalCode: "00001", country: "USA"}
    },
    {
        phone: "+15551112222",
        fullName: "Evan Gold",
        preferredName: "Evan",
        degree: "2nd",
        profilePhotoUrl: "https://placehold.co/100x100.png",
        email: "evan.gold@example.com",
        joinDate: "2023-11-11",
        status: "Active",
        groups: ["work-abc987"],
        referrer: "+12065551234",
        address: { street: "101 State St", city: "Chicago", state: "IL", postalCode: "60601", country: "USA"}
    },
    {
        phone: "+15553334444",
        fullName: "Fiona Apple",
        preferredName: "Fiona",
        degree: "3rd",
        profilePhotoUrl: "https://placehold.co/100x100.png",
        email: "fiona.apple@example.com",
        joinDate: "2023-10-10",
        status: "Active",
        groups: [],
        referrer: "+15551112222",
        address: { street: "202 Music Row", city: "New York", state: "NY", postalCode: "10001", country: "USA"}
    }
  ];
}
