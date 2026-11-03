import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';
import { api } from '../api/client';

export const HomePage: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { selectedVillage } = useLocation();
  const { speak, isSpeaking, stop, startVoiceSearch, isListening } = useVoice();
  const navigate = useNavigate();

  const [audioToastOpen, setAudioToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('"Tap the green button above to browse and rent available equipment."');
  const [nearbyMachines, setNearbyMachines] = useState<any[]>([]);

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Dnyaneshwar';
  const villageName = selectedVillage ? selectedVillage.nameEn : 'Baramati';

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await api.searchEquipment({ limit: 6 });
        const items = res.data?.listings || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setNearbyMachines(items);
      } catch (err) {
        console.warn('Failed to load listings', err);
      }
    };
    fetchMachines();
  }, []);

  const toggleAudioGuide = (forceState?: boolean, textToSpeak?: string) => {
    const nextState = forceState !== undefined ? forceState : !audioToastOpen;
    setAudioToastOpen(nextState);

    const message = textToSpeak || `Welcome, Farmer Friend! Find equipment, mandi rates and farm supplies in ${villageName}.`;
    setToastMessage(`"${message}"`);

    if (nextState) {
      speak(message);
      setTimeout(() => {
        setAudioToastOpen(false);
      }, 7000);
    } else {
      stop();
    }
  };

  const handleVoiceSearch = () => {
    startVoiceSearch((keyword) => {
      const upper = keyword.toUpperCase();
      if (upper.includes('TRACTOR')) {
        navigate('/equipment?category=TRACTOR');
      } else if (upper.includes('ROTAVATOR')) {
        navigate('/equipment?category=ROTAVATOR');
      } else if (upper.includes('HARVESTER')) {
        navigate('/equipment?category=HARVESTER');
      } else if (upper.includes('MANDI') || upper.includes('RATE') || upper.includes('PRICE')) {
        navigate('/prices');
      } else if (upper.includes('SUPPLY') || upper.includes('SEED') || upper.includes('FERTILIZER')) {
        navigate('/supplies');
      } else {
        navigate(`/equipment?search=${encodeURIComponent(keyword)}`);
      }
    });
  };

  const mahindraId = nearbyMachines.find((m) => m.titleEn?.toLowerCase().includes('mahindra'))?.id || '4147f46c-9155-4d9a-93f9-5a0b340464ec';
  const rotavatorId = nearbyMachines.find((m) => m.titleEn?.toLowerCase().includes('rotavator') || m.titleEn?.toLowerCase().includes('shaktiman'))?.id || 'f7972d24-b1dd-4a57-94f2-d6f5abdfdd47';
  const harvesterId = nearbyMachines.find((m) => m.titleEn?.toLowerCase().includes('harvester'))?.id || '728b14aa-a9f0-46e1-9938-a97810e90d5b';

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)]">
      <div className="flex flex-col w-full">
        {/* Full-width responsive container using screen edges efficiently */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4 md:py-6 flex flex-col gap-6 md:gap-8">
          
          {/* 1. Warm Personal Greeting Section (Black spot completely removed) */}
          <div className="relative overflow-hidden bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="relative z-10 flex flex-col max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-surface-container rounded-full w-fit mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  {villageName} Taluka • Have a Prosperous Day
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl">
                Hello {farmerName}! 🙏
              </h1>
              <p className="font-body-xl text-body-xl text-on-surface-variant mt-2 text-base sm:text-lg">
                What would you like to do on your farm today?
              </p>
              <span className="font-label-md text-label-md text-outline mt-1 text-xs sm:text-sm">
                Welcome, Farmer Friend! Find equipment, live mandi prices &amp; supplies.
              </span>
            </div>

            <div className="relative z-10 shrink-0 w-full sm:w-auto">
              <button
                className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-full hover:bg-tertiary-fixed-dim shadow-sm transition-all duration-200 active:scale-95 min-h-[56px]"
                id="voice-guide-btn"
                onClick={() => toggleAudioGuide(undefined, `Welcome ${farmerName}! You can rent tractors, list your equipment, check live mandi rates, or buy supplies in ${villageName}.`)}
                type="button"
              >
                <span className="material-symbols-outlined text-2xl text-tertiary animate-bounce">
                  volume_up
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-label-xl text-label-xl font-bold leading-none">
                    Listen to Info
                  </span>
                  <span className="font-label-md text-label-md text-tertiary leading-tight">
                    Audio Guide
                  </span>
                </div>
                {/* Voice Sound Wave Glyphs */}
                <span className="flex items-end gap-0.5 h-5 ml-1">
                  <span className="w-1 bg-tertiary rounded-full h-3 animate-pulse"></span>
                  <span className="w-1 bg-tertiary rounded-full h-5 animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 bg-tertiary rounded-full h-2 animate-pulse" style={{ animationDelay: '300ms' }}></span>
                  <span className="w-1 bg-tertiary rounded-full h-4 animate-pulse" style={{ animationDelay: '75ms' }}></span>
                </span>
              </button>
            </div>
          </div>

          {/* 2. Urgent Weather / Farming Alert Banner */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-3xl">wb_sunny</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md bg-secondary text-on-secondary px-2 py-0.5 rounded-md font-bold text-xs">
                    Weather Advisory
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-bold text-xs">
                    {villageName} • 31°C
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface font-semibold mt-1">
                  Today's Weather: {villageName} is sunny &amp; dry • Ideal day for tilling, sowing &amp; prep
                </p>
                <span className="font-label-md text-label-md text-on-surface-variant text-xs mt-0.5">
                  Sunny &amp; dry. Ideal for tractor tilling, land prep, and pesticide spraying.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => speak(`Today's weather in ${villageName} is sunny and 31 degrees Celsius. Clear conditions are forecast for the next 5 days. Ideal for tractor work.`)}
                className="px-4 py-2 bg-surface-container text-primary hover:bg-surface-variant font-label-lg text-label-lg rounded-full flex items-center gap-1.5 transition-colors shadow-sm min-h-[44px]"
                type="button"
              >
                <span>5-Day Forecast</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* 3. Four Primary Action Cards (Responsive grid utilizing screen width) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg text-primary flex items-center gap-2 font-bold text-xl sm:text-2xl">
                <span className="material-symbols-outlined text-secondary">apps</span>
                Choose Service
              </h2>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Tap large buttons to continue
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
              {/* CARD 1: Rent Equipment */}
              <div className="group bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-44 rounded-2xl overflow-hidden shadow-xs bg-surface-container">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Modern green tractor in sunny farm field"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwY4Sw-WDX1UPe2Q-8Ot1usGgS43FypbGuWZBmjzeUvBysGBU-0B4tUnvCvPrcVSLHCWJ7iYkiD1T7Gdc1j62bswkVbpUT6F9nt2VzU61KBAwEk3yTMFYt2Roo1OxWRL4McM6aUwNucT01yhIQxdTWchfgRYLEVM4NVohYTdL9YDSSrH0RpI3a-Jm4WsNsNMHl07Y4PFQ2yjrI-z7AQI677fuxL4RDu5TrK1qNIzOwzmJeYhLJYPSJjg"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-full font-bold text-xs">
                        42 Available
                      </span>
                      <span className="font-label-md text-label-md text-outline text-xs">Rent</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-primary font-bold leading-tight truncate text-lg">
                      Rent Equipment
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface font-medium mt-1 text-xs leading-relaxed">
                      Rent tractors, rotavators, and harvesters from nearby villages.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container/60">
                  <Link
                    to="/equipment"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-md font-bold py-3 px-4 rounded-full hover:opacity-95 shadow-sm active:scale-95 transition-all min-h-[48px] text-sm"
                  >
                    <span className="material-symbols-outlined text-xl">agriculture</span>
                    <span>Explore Machines (42)</span>
                  </Link>
                  <button
                    aria-label="Listen to Audio"
                    onClick={() => toggleAudioGuide(true, 'Rent machinery: 42 tractors, rotavators, and harvesters available near Baramati with verified drivers.')}
                    className="w-12 h-12 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">volume_up</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: List My Equipment */}
              <div className="group bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-44 rounded-2xl overflow-hidden shadow-xs bg-surface-container">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Smiling Indian farmer with tractor in field"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp3pPy3DRCoj1h_JGPtISIXcC6r3moDj6kFeXuCY13mmLHbGYtJWIjhvBWHFaN9-M2nj5CWc7Fo6x7o-QafBlzl7d41E1JztmbVCtnfhRDu7a55SEZTYZD0GFAS5BZDIqIc9JQcGLL9Vz5wuIoYpwdFCXvBa7Bb32jH1lcG4fTY-jkjNH24LB0Y7N_2sDMiyNNli9RSFlK0uVhSqyGryyq3jSz9vq9Rgdpj_IpasCTW-UZe-U40-3s9w"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md rounded-full font-bold text-xs">
                        Earn ₹2,500/day
                      </span>
                      <span className="font-label-md text-label-md text-outline text-xs">Earn</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-primary font-bold leading-tight truncate text-lg">
                      List &amp; Earn
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface font-medium mt-1 text-xs leading-relaxed">
                      Have an idle tractor? Rent it to village farmers and earn steady daily income.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container/60">
                  <Link
                    to="/list-equipment"
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-on-secondary font-label-md font-bold py-3 px-4 rounded-full hover:opacity-95 shadow-sm active:scale-95 transition-all min-h-[48px] text-sm"
                  >
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    <span>Register Machine</span>
                  </Link>
                  <button
                    aria-label="Listen to Audio"
                    onClick={() => toggleAudioGuide(true, 'List your equipment: Have an idle machine? Register it on Parijat and earn steady daily income from local farmers.')}
                    className="w-12 h-12 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">volume_up</span>
                  </button>
                </div>
              </div>

              {/* CARD 3: Live Mandi Rates */}
              <div className="group bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-44 rounded-2xl overflow-hidden shadow-xs bg-surface-container">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Harvested red onions, tomatoes, and wheat at mandi market"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpTJy9jN1q6i9wtpv_QiovSulhmJ2tBluX0_sFFNllHo6SLKq5dKVJEgpzoT2GkdKL-VHvwgkRl5H4YsuZA7SB9bQ6tpKsv2m80nWXIeWSfp3xLUsNTh3yW2VUT20AuCbWg8Prk9A1AgGP9eTu9cDGgFralkeNQqm46xptySWjVTEF5_ugz8mELkGFqkTn5qzhA3HNycY6ImKbOiyOQUQ4-5KO7J3b65TDToGhw8V_IjUNUonx-4lR1A"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-container text-primary font-label-md text-label-md rounded-full font-bold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                        Live APMC Rates
                      </span>
                      <span className="font-label-md text-label-md text-outline text-xs">Mandi</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-primary font-bold leading-tight truncate text-lg">
                      Live Mandi Rates
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface font-medium mt-1 text-xs leading-relaxed">
                      Pune, Baramati, Nashik APMC commodity rates for Onion, Soybean, Cotton.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container/60">
                  <Link
                    to="/prices"
                    className="flex-1 flex items-center justify-center gap-2 bg-surface-container text-primary font-label-md font-bold py-3 px-4 rounded-full hover:bg-surface-variant shadow-sm active:scale-95 transition-all min-h-[48px] text-sm"
                  >
                    <span className="material-symbols-outlined text-xl text-secondary">trending_up</span>
                    <span>Check Rates</span>
                  </Link>
                  <button
                    aria-label="Listen to Audio"
                    onClick={() => toggleAudioGuide(true, 'Live Mandi Rates: Check daily prices for Onion, Soybean, Wheat and Cotton in Pune, Baramati, and Nashik APMCs.')}
                    className="w-12 h-12 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">volume_up</span>
                  </button>
                </div>
              </div>

              {/* CARD 4: Farm Supplies & Seeds */}
              <div className="group bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-44 rounded-2xl overflow-hidden shadow-xs bg-surface-container">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Agricultural seed bags and organic bio fertilizer sacks"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw05Ep_8wmIPvXhR6wRffrf-VLzHn5fMX62D6nMj_1cxuhVWOi0vps3ioMi5ytEHOiLOzXsF-49VdzrgAdvl0O9TOKIWiHW7y7ND0dA8DTjzSIvhXAcD_1eEk560kpRFeBEplU0M29K4eaJmB8Y64I4UdHTsIrCm4O8niJa9X_9kgkQ1FOrgjT4EmBwYuq1n39riEqLRG-Mul92-ek6itbNgopwzEDioigo73eRBSYsFw5YHIM2P8Cww"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-full font-bold text-xs">
                        20% Group Discount
                      </span>
                      <span className="font-label-md text-label-md text-outline text-xs">Group Buy</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-primary font-bold leading-tight truncate text-lg">
                      Farm Supplies &amp; Seeds
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface font-medium mt-1 text-xs leading-relaxed">
                      Order certified seeds &amp; fertilizer directly with neighbors at bulk prices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container/60">
                  <Link
                    to="/supplies"
                    className="flex-1 flex items-center justify-center gap-2 bg-surface-container text-primary font-label-md font-bold py-3 px-4 rounded-full hover:bg-surface-variant shadow-sm active:scale-95 transition-all min-h-[48px] text-sm"
                  >
                    <span className="material-symbols-outlined text-xl text-secondary">shopping_bag</span>
                    <span>Order Supplies</span>
                  </Link>
                  <button
                    aria-label="Listen to Audio"
                    onClick={() => toggleAudioGuide(true, 'Farm Supplies: Join fellow village farmers to order certified seeds, fertilizers and sprayers at 20% discount.')}
                    className="w-12 h-12 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-variant transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">volume_up</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Hyperlocal Nearby Available Machinery Quick-Rail */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary flex items-center gap-2 font-bold text-xl sm:text-2xl">
                  <span className="material-symbols-outlined text-secondary">fmd_good</span>
                  Machines Available in Your Village Today
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  Available in your village {villageName} today • Instant booking &amp; direct owner contact
                </p>
              </div>
              <Link
                to="/equipment"
                className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary font-bold hover:underline self-start sm:self-auto"
              >
                <span>View all 42 machines</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {nearbyMachines && nearbyMachines.length > 0 ? (
                nearbyMachines.slice(0, 3).map((m, idx) => {
                  const fallbackPhotos = [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuC6NHk0rbXVewWa87DS1a7rWRrNxnHx_65e1SzWrWe1xjcI3pPCOowc6E2guQos2yCBg4MXgByj-zkGDbn8inz-nQn_Bt8iGbkT4442lBjjWnmBuJCq_1QwcGeofl_fZ8UPdpJ4yP_LwgmrOsgC3X9zGVZKtqE_Cn0FlIW3l2bfnDjMGgVp-gzoVAE_YW9iLbiIaMEtatGoxMa0RBww4Hkb35dyfq-jE9mj6NKD_oiFkVNzRKeUPrlfIQ',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Jt7Lp9jS4EUsohTVilhsNNRtxVzP-Cz2p86Dx1lcL1r-G6dcUY9TGnTICzpgvJY6-h_kfxQ3x10KKdaWm53piJ49MblQfsd6I96liJ8OqXkVI8O4rSNPydnxfU6gnmgiIHkzAV73AqvJkNpksNxrAy6mzoK_bVLagGAEnr7ZpiICCWCsFN82ey1Wt2-t279njbXtWEuXFWlh-FXDOs6HD9467wr8XhoGCUW7RZ0rG6bRnW08YGxgKg',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA068Vlb7ti7hbDFHgRpdfUrAi5oPv7nWHztckYRQzKbgjFZFpgNUma5FEzHROXioDzgmSuvmTBS1rEorZmj3pO0LpenfcSKliMkD6Mdv8pE8afmU1dt2XpLjafz6SIEjrqj5rf-nUavwCXU7L4ZhXFt1Q7LTjBGqdrMDaf3HV9cC8mssGArhnKIWZaTmawsf8lHqFIaau6-Zmu2aJSWVL8bYbdyych6p3tqZW3ElDYUONWDxZ1e6HOCw',
                  ];
                  const photo = m.images?.[0]?.url || fallbackPhotos[idx % fallbackPhotos.length];
                  const dist = m.distanceKm != null ? `${m.distanceKm.toFixed(1)} km` : `${1.8 + idx * 0.7} km (${m.villageName || 'Nearby'})`;
                  const phone = m.owner?.phone || m.owner?.maskedPhone || '9876543210';
                  const owner = m.owner?.name || 'Verified Farmer';

                  return (
                    <div key={m.id || idx} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="relative h-52 w-full bg-surface-container">
                          <img
                            className="w-full h-full object-cover"
                            alt={m.titleEn || 'Farm Machine'}
                            src={photo}
                          />
                          <span className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-md text-label-md text-primary font-bold flex items-center gap-1 shadow-sm text-xs">
                            <span className="material-symbols-outlined text-sm text-secondary">distance</span>
                            {dist}
                          </span>
                          <span className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-md text-label-md font-bold shadow-sm text-xs">
                            {m.isAvailable !== false ? 'Available Now' : 'Booked'}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-base truncate max-w-[180px]">
                                {m.titleEn || m.title || 'Farm Machine'}
                              </h4>
                              <p className="font-label-md text-label-md text-on-surface-variant text-xs truncate max-w-[180px]">
                                {m.category?.nameEn || m.description || 'Verified machinery'}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-headline-lg text-headline-lg text-primary font-bold text-xl">
                                ₹{m.rentalRate || 700}
                              </span>
                              <span className="font-label-md text-label-md text-outline block leading-none text-xs">
                                / {m.rentalUnit ? m.rentalUnit.toLowerCase() : 'hr'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 py-1.5 px-3 bg-surface-container-low rounded-xl">
                            <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                            <span className="font-label-md text-label-md text-on-surface font-medium truncate text-xs">
                              Owner: {owner}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <a
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-surface-container text-primary hover:bg-surface-variant font-label-md font-bold transition-all min-h-[44px] text-xs"
                          href={`tel:${phone}`}
                        >
                          <span className="material-symbols-outlined text-lg">call</span>
                          <span>Call</span>
                        </a>
                        <Link
                          to={`/equipment/${m.id}`}
                          className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-sm transition-all min-h-[44px] text-xs"
                        >
                          <span>View Details</span>
                          <span className="material-symbols-outlined text-base">chevron_right</span>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Quick Machine 1: Mahindra 575 DI */}
                  <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-52 w-full bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Mahindra 575 DI Tractor"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6NHk0rbXVewWa87DS1a7rWRrNxnHx_65e1SzWrWe1xjcI3pPCOowc6E2guQos2yCBg4MXgByj-zkGDbn8inz-nQn_Bt8iGbkT4442lBjjWnmBuJCq_1QwcGeofl_fZ8UPdpJ4yP_LwgmrOsgC3X9zGVZKtqE_Cn0FlIW3l2bfnDjMGgVp-gzoVAE_YW9iLbiIaMEtatGoxMa0RBww4Hkb35dyfq-jE9mj6NKD_oiFkVNzRKeUPrlfIQ"
                        />
                        <span className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-md text-label-md text-primary font-bold flex items-center gap-1 shadow-sm text-xs">
                          <span className="material-symbols-outlined text-sm text-secondary">distance</span>
                          1.8 km (Gaothan)
                        </span>
                        <span className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-md text-label-md font-bold shadow-sm text-xs">
                          Available Now
                        </span>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-base">
                              Mahindra 575 DI Tractor
                            </h4>
                            <p className="font-label-md text-label-md text-on-surface-variant text-xs">
                              45 HP • Tilling &amp; trolley ready
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-headline-lg text-headline-lg text-primary font-bold text-xl">
                              ₹750
                            </span>
                            <span className="font-label-md text-label-md text-outline block leading-none text-xs">
                              / hr
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-3 bg-surface-container-low rounded-xl">
                          <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                          <span className="font-label-md text-label-md text-on-surface font-medium truncate text-xs">
                            Owner: Bapurao Taware (Verified)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <a
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-surface-container text-primary hover:bg-surface-variant font-label-md font-bold transition-all min-h-[44px] text-xs"
                        href="tel:9876543210"
                      >
                        <span className="material-symbols-outlined text-lg">call</span>
                        <span>Call</span>
                      </a>
                      <Link
                        to={`/equipment/${mahindraId}`}
                        className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-sm transition-all min-h-[44px] text-xs"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Machine 2: Shaktiman Rotavator */}
                  <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-52 w-full bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Shaktiman Rotavator"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Jt7Lp9jS4EUsohTVilhsNNRtxVzP-Cz2p86Dx1lcL1r-G6dcUY9TGnTICzpgvJY6-h_kfxQ3x10KKdaWm53piJ49MblQfsd6I96liJ8OqXkVI8O4rSNPydnxfU6gnmgiIHkzAV73AqvJkNpksNxrAy6mzoK_bVLagGAEnr7ZpiICCWCsFN82ey1Wt2-t279njbXtWEuXFWlh-FXDOs6HD9467wr8XhoGCUW7RZ0rG6bRnW08YGxgKg"
                        />
                        <span className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-md text-label-md text-primary font-bold flex items-center gap-1 shadow-sm text-xs">
                          <span className="material-symbols-outlined text-sm text-secondary">distance</span>
                          2.5 km (Pimpali)
                        </span>
                        <span className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-md text-label-md font-bold shadow-sm text-xs">
                          Available Today
                        </span>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-base">
                              Shaktiman Rotavator (7 ft)
                            </h4>
                            <p className="font-label-md text-label-md text-on-surface-variant text-xs">
                              High performance blades • 42 blades
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-headline-lg text-headline-lg text-primary font-bold text-xl">
                              ₹500
                            </span>
                            <span className="font-label-md text-label-md text-outline block leading-none text-xs">
                              / hr
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-3 bg-surface-container-low rounded-xl">
                          <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                          <span className="font-label-md text-label-md text-on-surface font-medium truncate text-xs">
                            Owner: Ramesh Jagtap (4.9 ★)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <a
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-surface-container text-primary hover:bg-surface-variant font-label-md font-bold transition-all min-h-[44px] text-xs"
                        href="tel:9876543211"
                      >
                        <span className="material-symbols-outlined text-lg">call</span>
                        <span>Call</span>
                      </a>
                      <Link
                        to={`/equipment/${rotavatorId}`}
                        className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-sm transition-all min-h-[44px] text-xs"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Machine 3: Kubota Paddy Harvester */}
                  <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-52 w-full bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          alt="Kubota Combine Harvester"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA068Vlb7ti7hbDFHgRpdfUrAi5oPv7nWHztckYRQzKbgjFZFpgNUma5FEzHROXioDzgmSuvmTBS1rEorZmj3pO0LpenfcSKliMkD6Mdv8pE8afmU1dt2XpLjafz6SIEjrqj5rf-nUavwCXU7L4ZhXFt1Q7LTjBGqdrMDaf3HV9cC8mssGArhnKIWZaTmawsf8lHqFIaau6-Zmu2aJSWVL8bYbdyych6p3tqZW3ElDYUONWDxZ1e6HOCw"
                        />
                        <span className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full font-label-md text-label-md text-primary font-bold flex items-center gap-1 shadow-sm text-xs">
                          <span className="material-symbols-outlined text-sm text-secondary">distance</span>
                          4.0 km (Malegaon)
                        </span>
                        <span className="absolute top-3 right-3 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full font-label-md text-label-md font-bold shadow-sm text-xs">
                          With Driver
                        </span>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-headline-md text-headline-md text-on-surface font-bold text-base">
                              Kubota Combine Harvester
                            </h4>
                            <p className="font-label-md text-label-md text-on-surface-variant text-xs">
                              Soybean, wheat &amp; paddy harvester
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-headline-lg text-headline-lg text-primary font-bold text-xl">
                              ₹1,400
                            </span>
                            <span className="font-label-md text-label-md text-outline block leading-none text-xs">
                              / hr
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 py-1.5 px-3 bg-surface-container-low rounded-xl">
                          <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                          <span className="font-label-md text-label-md text-on-surface font-medium truncate text-xs">
                            Owner: Vijay Sawant (Verified)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <a
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-surface-container text-primary hover:bg-surface-variant font-label-md font-bold transition-all min-h-[44px] text-xs"
                        href="tel:9876543212"
                      >
                        <span className="material-symbols-outlined text-lg">call</span>
                        <span>Call</span>
                      </a>
                      <Link
                        to={`/equipment/${harvesterId}`}
                        className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-sm transition-all min-h-[44px] text-xs"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 5. Quick Voice Guide & Toll-Free Farmer Support Box */}
          <div className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center text-primary shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-4xl">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider text-xs">
                  Free Farmer Assistance • 24/7 Service
                </span>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold text-xl">
                  Need assistance? Tap to speak
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-xs sm:text-sm">
                  Our Krishi Mitra team can help you book machinery and understand mandi rates over a free call.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary text-on-primary rounded-full hover:bg-primary-container shadow-sm font-label-md font-bold transition-all active:scale-95 min-h-[48px]"
                href="tel:18002335500"
              >
                <span className="material-symbols-outlined text-xl">call</span>
                <span>1800-233-5500 (Toll Free)</span>
              </a>
              <button
                className={`flex items-center justify-center gap-2 px-6 py-3.5 font-label-md font-bold rounded-full shadow-sm transition-all active:scale-95 min-h-[48px] ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim'
                }`}
                onClick={handleVoiceSearch}
                type="button"
              >
                <span className="material-symbols-outlined text-xl text-tertiary">mic</span>
                <span>{isListening ? 'Listening...' : 'Speak to Search'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Audio Instruction Toast Notification / Floating Interactive Overlay */}
        <div
          className={`fixed bottom-24 md:bottom-8 right-4 max-w-sm w-[calc(100%-2rem)] bg-inverse-surface text-inverse-on-surface p-4 rounded-2xl shadow-2xl transition-all duration-300 transform z-50 flex items-center gap-3 ${
            audioToastOpen
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-32 opacity-0 pointer-events-none'
          }`}
          id="audio-modal"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
            <span className="material-symbols-outlined text-2xl animate-spin">sync</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-label-lg text-label-lg font-bold leading-tight truncate">
              English Voice Guide Active...
            </p>
            <p className="font-label-md text-label-md text-inverse-on-surface/80 text-xs mt-0.5">
              {toastMessage}
            </p>
          </div>
          <button
            className="p-1 rounded-full hover:bg-inverse-surface/80 text-inverse-on-surface shrink-0"
            onClick={() => toggleAudioGuide(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

      </div>
    </main>
  );
};
