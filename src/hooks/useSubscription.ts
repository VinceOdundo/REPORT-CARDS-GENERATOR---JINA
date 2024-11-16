import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../features/auth/useAuth';

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'cancelled';
  plan: 'free' | 'basic' | 'premium';
  reportCardsRemaining: number;
  validUntil: Date;
  features: string[];
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        if (doc.exists()) {
          setSubscription({
            id: doc.id,
            ...doc.data(),
            validUntil: doc.data().validUntil?.toDate()
          } as Subscription);
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { subscription, loading, error };
};