"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { type Member, createNewMember } from '@/services/memberService';
import { doc, onSnapshot, getDocs, collection, query, where } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
  signUpWithEmailAndPassword: (data: any) => Promise<void>;
  signInWithEmailAndPassword: (phone: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  member: null,
  loading: true,
  signUpWithEmailAndPassword: async () => {},
  signInWithEmailAndPassword: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not configured.");
      setLoading(false);
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        // Not logged in, no member profile to fetch.
        setMember(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeMember: () => void;
    if (user && db) {
      // User is authenticated, now find their member profile using their UID
      const q = query(collection(db, "members"), where("uid", "==", user.uid));
      getDocs(q).then(snapshot => {
        if (!snapshot.empty) {
            const memberDoc = snapshot.docs[0];
            unsubscribeMember = onSnapshot(doc(db, "members", memberDoc.id), (doc) => {
                setMember(doc.data() as Member);
                setLoading(false);
            });
        } else {
            // This can happen briefly during sign-up before the member doc is created.
            // Or if a user exists in Auth but not in the members collection.
            setMember(null);
            setLoading(false);
        }
      });
    } else {
        setLoading(false);
    }

    return () => {
        if (unsubscribeMember) {
            unsubscribeMember();
        }
    };
  }, [user]);

  const signUpWithEmailAndPassword = async (data: any) => {
    if (!auth || !db) throw new Error("Auth or DB not initialized");
    
    // 1. Check if phone number already exists
    const phoneQuery = query(collection(db, 'members'), where('phone', '==', data.phone));
    const phoneSnapshot = await getDocs(phoneQuery);
    if (!phoneSnapshot.empty) {
        throw new Error('This phone number is already registered.');
    }

    // 2. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const authUser = userCredential.user;

    // 3. Create member document in Firestore, using phone number as the ID
    const newMemberData: Omit<Member, 'phone'> = {
        uid: authUser.uid, // Link to the auth user
        fullName: data.fullName,
        preferredName: data.fullName.split(' ')[0],
        email: data.email,
        address: { ...data.address, obfuscated: `${data.address.city}, ${data.address.state}` },
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        onboardingCompleted: true,
    };
    await createNewMember(data.phone, newMemberData);
  };
  
  const signInWithEmailAndPassword = async (phone: string, password: string) => {
    if (!auth || !db) throw new Error("Auth or DB not initialized");

    // 1. Find the member document by phone number to get the email
    const q = query(collection(db, 'members'), where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("No account found with that phone number.");
    }
    const memberData = querySnapshot.docs[0].data() as Member;
    
    // 2. Use the retrieved email to sign in with Firebase Auth
    if (!memberData.email) {
      throw new Error("Account is missing an email address for login.");
    }
    await signInWithEmailAndPassword(auth, memberData.email, password);
    router.push('/dashboard/overview');
  }

  const value = {
    user,
    member,
    loading,
    signUpWithEmailAndPassword,
    signInWithEmailAndPassword,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
