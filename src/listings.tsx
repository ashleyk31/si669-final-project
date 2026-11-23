import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export type Listing = {
  id: string;
  name: string;
  quantity: string;
  category: string;
  expiresOn: string;
  location: string;
  notes: string;
  imageUri?: string;
  createdAt: number;
  sample?: boolean;
};

const STORAGE_KEY = 'pantryshare.listings.v1';
const PICKS_KEY = 'pantryshare.picks.v1';

function dateInDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const samples: Listing[] = [
  { id: 'sample-1', name: 'Fresh garden tomatoes', quantity: 'About 2 lbs', category: 'Groceries', expiresOn: dateInDays(3), location: 'Kerrytown', notes: 'Picked this week. Great for sauce or salad.', createdAt: 1, sample: true },
  { id: 'sample-2', name: 'Homemade veggie soup', quantity: '2 servings', category: 'Home-cooked', expiresOn: dateInDays(2), location: 'Old West Side', notes: 'Contains celery. Packed in sealed containers.', createdAt: 2, sample: true },
  { id: 'sample-3', name: 'Extra bread flour', quantity: '1 unopened bag', category: 'Baking', expiresOn: dateInDays(15), location: 'Downtown', notes: 'Happy to share with a neighbor who bakes.', createdAt: 3, sample: true },
];

type ListingsContextValue = {
  listings: Listing[];
  pickedIds: string[];
  ready: boolean;
  pickBusy: boolean;
  error: string;
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<boolean>;
  togglePick: (id: string) => Promise<boolean>;
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(samples);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [pickBusy, setPickBusy] = useState(false);
  const pickLock = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    AsyncStorage.multiGet([STORAGE_KEY, PICKS_KEY])
      .then(([[, listingsRaw], [, picksRaw]]) => {
        if (!mounted) return;
        if (listingsRaw) {
          const stored: unknown = JSON.parse(listingsRaw);
          if (Array.isArray(stored)) {
            const valid = stored.filter((item): item is Listing => typeof item === 'object' && item !== null && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.expiresOn === 'string');
            setListings([...valid, ...samples]);
          }
        }
        if (picksRaw) {
          const stored: unknown = JSON.parse(picksRaw);
          if (Array.isArray(stored)) setPickedIds(stored.filter((id): id is string => typeof id === 'string'));
        }
      })
      .catch(() => { if (mounted) setError('Saved listings or picks could not be loaded. Sample listings are still available.'); })
      .finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);

  async function addListing(input: Omit<Listing, 'id' | 'createdAt'>) {
    const listing = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, createdAt: Date.now() };
    const next = [listing, ...listings];
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next.filter(item => !item.sample)));
      setListings(next);
      setError('');
      return true;
    } catch {
      setError('This listing could not be saved on this device. Try a smaller photo or try again.');
      return false;
    }
  }

  async function togglePick(id: string) {
    if (!ready || pickLock.current || !listings.some(item => item.id === id)) return false;
    const next = pickedIds.includes(id) ? pickedIds.filter(pickedId => pickedId !== id) : [...pickedIds, id];
    pickLock.current = true;
    setPickBusy(true);
    try {
      await AsyncStorage.setItem(PICKS_KEY, JSON.stringify(next));
      setPickedIds(next);
      setError('');
      return true;
    } catch {
      setError('Your pick could not be saved on this device. Please try again.');
      return false;
    } finally {
      pickLock.current = false;
      setPickBusy(false);
    }
  }

  return <ListingsContext.Provider value={{ listings, pickedIds, ready, pickBusy, error, addListing, togglePick }}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const value = useContext(ListingsContext);
  if (!value) throw new Error('useListings must be used inside ListingsProvider');
  return value;
}

export function expiryLabel(date: string, today = new Date()) {
  const [year, month, day] = date.split('-').map(Number);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const expiry = new Date(year, month - 1, day).getTime();
  const days = Math.round((expiry - start) / 86400000);
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}
