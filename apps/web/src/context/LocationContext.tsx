import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

export interface Village {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  taluka: string;
  district: string;
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  villages: Village[];
  selectedVillageId: string;
  setSelectedVillageId: (id: string) => void;
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  userCoords: { latitude: number; longitude: number } | null;
  selectedVillage: Village | undefined;
  requestGps: () => void;
}

const VILLAGE_STORAGE_KEY = 'parijat_village_id';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [villages, setVillages] = useState<Village[]>([]);
  // Restore persisted village selection from localStorage on initial render
  const [selectedVillageId, _setSelectedVillageId] = useState<string>(
    () => localStorage.getItem(VILLAGE_STORAGE_KEY) || ''
  );
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Wrap setter to also persist preference to localStorage
  const setSelectedVillageId = (id: string) => {
    _setSelectedVillageId(id);
    localStorage.setItem(VILLAGE_STORAGE_KEY, id);
  };

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await api.getVillages();
        const list: Village[] = res.data || [];
        setVillages(list);

        // Only auto-select if no stored preference exists
        if (list.length > 0 && !localStorage.getItem(VILLAGE_STORAGE_KEY)) {
          const baramati = list.find((v) => v.nameEn.toLowerCase() === 'baramati');
          setSelectedVillageId(baramati ? baramati.id : list[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch villages:', err);
      }
    };
    fetchVillages();
  }, []);

  const requestGps = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
        }
      );
    }
  };

  const selectedVillage = villages.find((v) => v.id === selectedVillageId);

  return (
    <LocationContext.Provider
      value={{
        villages,
        selectedVillageId,
        setSelectedVillageId,
        radiusKm,
        setRadiusKm,
        userCoords,
        selectedVillage,
        requestGps,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
