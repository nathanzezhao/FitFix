"use client";
import { createContext, useContext, useState, useCallback } from "react";

const defaultProfile = {
  // identity / fit
  gender: null, // 'men' | 'women' | 'unisex'
  fitPreference: "regular", // 'slim' | 'regular' | 'loose' | 'oversized'
  heightCm: 175,
  weightKg: 70,
  bodyType: "average", // 'slim' | 'athletic' | 'average' | 'heavy'

  // taste
  interests: [], // ['gym','finance','art','music','outdoors','tech']
  styles: [], // ['minimalist','streetwear','gothic','y2k','gorpcore','workwear','preppy']
  occasion: "casual", // 'casual' | 'work' | 'date' | 'party' | 'gym' | 'formal'
  budget: "uniqlo", // 'uniqlo' | 'zara' | 'ssense'
  favoriteColors: [], // hex strings

  // color analysis
  undertoneFromQuiz: null, // 'warm' | 'cool' | 'neutral'
  undertoneFromPhoto: null,
  undertone: null, // final — user can override
  selfieDataUrl: null,

  // closet (user-owned items, color + type only, no brand)
  closet: [],

  // weekly plan
  weeklyOutfitIds: [null, null, null, null, null, null, null], // Mon..Sun
};

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);

  const update = useCallback(
    (patch) => setProfile((p) => ({ ...p, ...patch })),
    []
  );

  const addClosetItem = useCallback(
    (item) =>
      setProfile((p) => ({
        ...p,
        closet: [...p.closet, { id: crypto.randomUUID(), ...item }],
      })),
    []
  );

  const removeClosetItem = useCallback(
    (id) =>
      setProfile((p) => ({
        ...p,
        closet: p.closet.filter((i) => i.id !== id),
      })),
    []
  );

  const setDayOutfit = useCallback(
    (dayIdx, outfitId) =>
      setProfile((p) => {
        const next = [...p.weeklyOutfitIds];
        next[dayIdx] = outfitId;
        return { ...p, weeklyOutfitIds: next };
      }),
    []
  );

  return (
    <ProfileContext.Provider
      value={{ profile, update, addClosetItem, removeClosetItem, setDayOutfit }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
