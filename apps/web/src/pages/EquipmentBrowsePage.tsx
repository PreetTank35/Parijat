import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';

export const EquipmentBrowsePage: React.FC = () => {
  const { i18n } = useTranslation();
  const { selectedVillage, selectedVillageId } = useLocation();
  const { speak, isSpeaking, stop, startVoiceSearch, isListening } = useVoice();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'TRACTOR'
  );
  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [audioModalOpen, setAudioModalOpen] = useState<boolean>(false);

  const villageName = selectedVillage ? selectedVillage.nameEn : 'Baramati';

  const categories = [
    {
      code: 'TRACTOR',
      label: 'Tractor',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhgg84n2s-rgF1RXxQ4pdqgJ0s0fwucEFc6RkD32ySVcbE4FxKKL62HEVywLK6Ju2_K2Rrk-2DGZ1GAj5qG5c5O-xFUoEHHvMJrg-wQ_2Cy21cpOC-bDFL5XBGqxXf_5RPV5mM8WQKg7cCRfXJ4cI5De6FsShmNmdlMTONmQ6WGc7UCuvKCHoJraiKKxpLDqnUnUNHxP6k0feL1ajMOoY9UyGFirMd5coO1CsEyxUoRhkvtBA8Bsf3Xw',
    },
    {
      code: 'ROTAVATOR',
      label: 'Rotavator',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrqhy9SO5-cgsyiKbvFmHWBMW0x3C3_gf-Rp7bffyU3DcDZaTuNcFJom9XqnyXCRoWcLI43VTHPli3hqBEeO6IvAX4nHDQ1EpmZU8xgaUxQuxAxEXuwmV7B5UUf8An22wCSmFZitD4brI2qwXi491Hie8lqIWL2D_Kk2C7hYa4bLwoRCbENx571abiDJRlyiSqEf4t0ZHEJA-bWrH19M9Jc606UdSVPEzkeJSDkNu5-JRu-cC2NmhpOg',
    },
    {
      code: 'HARVESTER',
      label: 'Harvester',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZD9QSgcgvUm_eQ9NtjHh7DzGxy5G33h4X_2qmALykZPJ_NfYXNiayCNaBj8651TGSWngrMsN71LEbw_2jJV3bjNFuwA-o8meAB41hgxZGn11p4afE741bviirsFpBPD3sGSNflV-n2U6YEOnHB0gAp74vddqemQCUVLrb6RvKv2lVguMiZ1wetqIpr7j8pb95AhLjsnQlwjaIREsxZw9mj9auob86uZk7geV5uhWrN9TtR8NXx33X_w',
    },
    {
      code: 'WATER_PUMP',
      label: 'Water Pump',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiDEVvyhbhjdstm9t_V4uSSDPm_FniIPzRuddZp9vrcBAvQKO1xgUmfSY18AO04MPEHeofXHzIzhEaRbVMFxYqfMHyyMs8KOnb8dp6Ady1JDzNn3zXkfo0ppxOXf1on8hCTZpvGrJuinu-bdhUM3Psb_5ctzGhNHwGbcklt1iIEtRq3n73nocaQjtbYjLSAMsUrye79nE6xT-DWpjqNqB-YD2JjosnZ62NM5LDhwZlHxXbMwDwxznXvA',
    },
    {
      code: 'SPRAYER',
      label: 'Sprayer',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhLcKLGJntszQKeQxqK13lUINO0cxMjO5rq1_ciUmxbdwoz320syLso9F068zB3Cmd7gEIO11NCXlzRqbL_Pa-NAGwYYtinnMbSQR2S1_1bjrP0X76RxecSIFS8w-IIKP97zyV-fahJwbxu-J42HEMXMOt5g9EXE4tHqC4KoRo8fumSSi3rMJ5DR0XHeTcJQ1kjYA2sujIdiVuXeGn6rgqKWLkFgFUB9MPct1WDUaVa-wbUTzDqoHWGA',
    },
    {
      code: 'PLOUGH',
      label: 'Cultivator',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7qgpmkFW-Ujgl355WhlfKEUDW7ymOlf_pkfFntB58z4njEgKjQEjZBWeEb-Oq54uBxQys9p9f__BqdnQEkBu8MbkrU9iWdJhbao-mu9ByDlWVegjABrHpZ4ew6KR9tJymPNBBPYvYE-ZYHLV9JCXH3H4DpAs56FpjXd3yC3AfMqeI1P67ZPnxEXeal0R_AHP2KbEl7PPI-_0hVTnKIZ0NwrQIc66us4InzFUdTYhy3gJmT4mrDYcFHg',
    },
    {
      code: 'THRESHER',
      label: 'Thresher',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBneCDE8mnrWDtIRmqNRNf-2JlPtfn0VyowRCSnGqhdHuksVQXqyVbTgEfOCQ0fumwTEUbPpPGP8KQraPLPl86Heq7Rd9AnId-5z-fAAUHf8neDy99m0m_jDYRzFYVnxnUTaqhtfxDUvL8sLHFKJm58bfrdS9E2Qi31QQD9Sw6zt3PCFl8uec357W08HJ0wWyuUto_e6sRUEQJeFYfaBp0k79LD5wpk93PL2QSg8Yp6gHBhCtNUC6mHOQ',
    },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await api.searchEquipment({
          categoryCode: selectedCategory || undefined,
          villageId: selectedVillageId || undefined,
          radiusKm: distanceKm,
        });
        const items = res.data?.listings || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setListings(items);
      } catch (err) {
        console.warn('Failed to fetch equipment listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [selectedCategory, selectedVillageId, distanceKm]);

  const handleCategoryClick = (code: string) => {
    setSelectedCategory(code);
    setSearchParams({ category: code });
    speak(`Showing available ${code.toLowerCase()}s in ${villageName} within ${distanceKm} kilometres.`);
  };

  const handleScreenAudio = () => {
    if (isSpeaking) {
      stop();
      setAudioModalOpen(false);
    } else {
      setAudioModalOpen(true);
      speak(
        `Rent Equipment in ${villageName}. Showing verified machines ready for hire within ${distanceKm} kilometres. Tap any card to view driver details, fuel options, and booking rates.`
      );
    }
  };

  const handleVoiceSearch = () => {
    startVoiceSearch((keyword) => {
      const upper = keyword.toUpperCase();
      if (upper.includes('TRACTOR')) {
        setSelectedCategory('TRACTOR');
      } else if (upper.includes('ROTAVATOR')) {
        setSelectedCategory('ROTAVATOR');
      } else if (upper.includes('HARVESTER')) {
        setSelectedCategory('HARVESTER');
      } else if (upper.includes('PUMP')) {
        setSelectedCategory('WATER_PUMP');
      } else if (upper.includes('SPRAYER')) {
        setSelectedCategory('SPRAYER');
      } else {
        speak(`Searching for ${keyword}`);
      }
    });
  };

  const machines = [
    {
      id: '4147f46c-9155-4d9a-93f9-5a0b340464ec',
      title: 'Mahindra 575 DI Tractor',
      badge: '45 HP Power',
      status: 'Available Immediately',
      loc: 'Vadgaon, Baramati • 2.5 km',
      rate: '₹700',
      dayRate: '₹3,500 / day',
      shift: '8-hr shift (includes driver)',
      owner: 'Tukaram Jadhav',
      rating: '4.9 ★',
      trips: '28 bookings',
      driverIncluded: true,
      dieselIncluded: true,
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpmvn-ew7IxRrGV1zgNV_NPcmM5Lvt3YvSH8VzGqpSXU7uMcwVTZdukNOXFG4w8z0TPQUphAI8u3rO0GUtih7RgvVIODcuDTqQwI-0raP8YvQH8-_zB29o0mWSdVrPOtIQpP3sHc1GDWpUvUUGwCWKYuQ6NmdUVt08VSERes6CAtAYeZodF7W3NZ17QRS0LgHBCBoj2-FdgGP3g8KUvYrbAdte7G5f7yWEb_lDL0rgqrsAj5W33dM7Lw',
      phone: '9823000000',
    },
    {
      id: '750405a9-ce58-43fd-af33-51b63986e821',
      title: 'John Deere 5050D 4WD',
      badge: '4WD Heavy Duty',
      status: 'Available Tomorrow',
      loc: 'Shirsufal • 4.0 km',
      rate: '₹850',
      dayRate: '₹4,100 / day',
      shift: 'Includes hydraulic trolley',
      owner: 'Sanjay Shinde',
      rating: '4.8 ★',
      trips: '15 bookings',
      driverIncluded: true,
      dieselIncluded: false,
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIvbDYezDnjU8L0BzEScBORjEk5_1wwvDeB4fP3kyyI5cbNqgJmY1wdkJCK9sDONZeZBSDldM6OKjL73kCzKTfjBntXsar3VptLZ3oMtxV-Nh9jqhSE8PBlwea-QfuM5OAISpzNo3VgPtGizGiruIrO1MycFuArw8ySVauAZYybLcNr9MaINzNRvLXVauO2n2BYAXouYLxtci3_KzJ-Nt1iCeXeLy2_WgrcbCxfJZhf_4noDLMLrkq9Q',
      phone: '9823000001',
    },
    {
      id: 'f7972d24-b1dd-4a57-94f2-d6f5abdfdd47',
      title: 'Shaktiman 7-ft Rotavator',
      badge: '48 Heavy Blades',
      status: 'Ready Now',
      loc: 'Loni Bhapkar • 3.2 km',
      rate: '₹450',
      dayRate: '₹2,200 / day',
      shift: 'Universal 3-point hitch',
      owner: 'Ganesh Kharat',
      rating: '4.7 ★',
      trips: 'Verified Owner',
      driverIncluded: false,
      dieselIncluded: false,
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxUfpTxDv-nlhxrm-4cd1eNKEfTREy681euZsDqhedUg3CegQM7RfUOhkZBiPCwm0xvXNqdTPNMx7qMSLTu2NaaQNvpeEmTc-2TYK26-fKO8F9jNktGPY97zfHsEEYp8-uGT3tIDHj1FwUs7fpggAeU574WL_xCRZsJ8LK7OfJv50aJXdZcZjGie32ur84drC4lqtvNJ7j_ghuphN9yrAfSHsR4f6ERuLIfa8y77poeinJjTk-YiPxUA',
      phone: '9823000002',
    },
  ];

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-4">
      <div className="flex flex-col w-full">
        {/* Full width container spanning screen smoothly */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col gap-6 md:gap-8">
          
          {/* Top Action & Location Control Bar */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-surface-container flex flex-col gap-4">
            {/* Header line */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface font-label-md font-bold transition-colors min-h-[44px] text-xs"
                >
                  <span className="material-symbols-outlined text-primary text-lg">arrow_back</span>
                  <span>Back to Home</span>
                </Link>
                <div className="flex flex-col">
                  <h1 className="font-headline-xl text-primary font-bold tracking-tight text-xl sm:text-2xl lg:text-3xl">
                    Rent Farm Equipment
                  </h1>
                  <span className="font-body-md text-on-surface-variant text-xs sm:text-sm">
                    Verified tractors, harvesters &amp; tillage tools near your village
                  </span>
                </div>
              </div>

              <button
                onClick={handleScreenAudio}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md font-bold shadow-sm transition-all min-h-[44px] text-xs"
                id="screen-narrator-btn"
                type="button"
              >
                <span className="material-symbols-outlined text-tertiary text-xl">volume_up</span>
                <span>Audio Guide</span>
              </button>
            </div>

            {/* Radius and village line */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/60 rounded-xl p-4 border border-surface-container/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">near_me</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-secondary uppercase tracking-wider font-bold text-[11px]">
                    Current Search Center
                  </span>
                  <span className="font-headline-md text-on-surface text-sm sm:text-base font-semibold">
                    Showing machinery within radius of <strong className="text-primary font-bold">{villageName}</strong>
                  </span>
                </div>
              </div>

              {/* Distance Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" id="distance-pill-group">
                {[5, 10, 20].map((dist) => (
                  <button
                    key={dist}
                    onClick={() => {
                      setDistanceKm(dist);
                      speak(`Distance radius set to ${dist} kilometres`);
                    }}
                    className={`px-4 py-2 rounded-full font-label-md font-bold transition-all min-h-[40px] text-xs flex items-center gap-1.5 whitespace-nowrap ${
                      distanceKm === dist
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                    }`}
                    type="button"
                  >
                    {distanceKm === dist && (
                      <span className="material-symbols-outlined text-base">check</span>
                    )}
                    <span>Within {dist} km</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Machinery Category Selector */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">category</span>
                <span className="font-headline-md text-on-surface font-bold text-base sm:text-lg">
                  Select Equipment Category
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">
                7 categories available
              </span>
            </div>

            <div className="w-full overflow-x-auto pb-2 flex gap-3 scroll-smooth">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.code;
                return (
                  <button
                    key={cat.code}
                    onClick={() => handleCategoryClick(cat.code)}
                    className={`flex flex-col items-center justify-between p-2.5 rounded-2xl shrink-0 w-[120px] h-[134px] transition-all transform hover:-translate-y-0.5 border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-md'
                        : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-surface-container shadow-xs'
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-full h-18 rounded-xl overflow-hidden flex items-center justify-center p-1 ${
                        isSelected ? 'bg-surface-container-lowest' : 'bg-surface-container-low'
                      }`}
                    >
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        alt={cat.label}
                        src={cat.img}
                      />
                    </div>
                    <span className="font-label-md font-bold leading-tight text-center text-xs mt-1">
                      {cat.label}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-secondary-container' : 'opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Bar */}
          <div className="w-full flex items-center justify-between bg-surface-container-lowest px-4 py-3 rounded-xl border border-surface-container shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">
                Ready in {villageName}: <strong className="text-primary font-bold">14 verified machines</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
              <span className="material-symbols-outlined text-secondary text-base">verified</span>
              <span>All machines inspected</span>
            </div>
          </div>

          {/* Machinery Grid — renders live API data with local fallback */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {loading ? (
              // Skeleton loaders for perceived performance
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xs border border-surface-container animate-pulse flex flex-col" style={{ height: 460 }}>
                  <div className="h-60 bg-surface-container" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-5 bg-surface-container rounded-full w-3/4" />
                    <div className="h-4 bg-surface-container rounded-full w-1/2" />
                    <div className="h-16 bg-surface-container rounded-2xl" />
                  </div>
                </div>
              ))
            ) : listings.length > 0 ? (
              // Render live API listings
              listings.map((m: any) => {
                const title = m.titleEn || 'Farm Equipment';
                const rate = m.rentalRate || 0;
                const ownerName = m.owner?.name || 'Verified Owner';
                const phone = m.owner?.maskedPhone || '';
                const loc = m.villageName || 'Nearby Village';
                const imgUrl = m.images?.[0]?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpmvn-ew7IxRrGV1zgNV_NPcmM5Lvt3YvSH8VzGqpSXU7uMcwVTZdukNOXFG4w8z0TPQUphAI8u3rO0GUtih7RgvVIODcuDTqQwI-0raP8YvQH8-_zB29o0mWSdVrPOtIQpP3sHc1GDWpUvUUGwCWKYuQ6NmdUVt08VSERes6CAtAYeZodF7W3NZ17QRS0LgHBCBoj2-FdgGP3g8KUvYrbAdte7G5f7yWEb_lDL0rgqrsAj5W33dM7Lw';
                const dist = m.distanceKm ? `${m.distanceKm.toFixed(1)} km` : '';
                const rating = m.avgRating ? `${m.avgRating} ★` : 'New';
                return (
                  <div
                    key={m.id}
                    className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-surface-container hover:border-primary/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full h-60 bg-surface-container overflow-hidden">
                        <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt={title} src={imgUrl} />
                        {dist && (
                          <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                            <span className="material-symbols-outlined text-amber-400 text-sm">location_on</span>
                            <span>{loc} • {dist}</span>
                          </div>
                        )}
                        <button
                          onClick={() => speak(`${title}. Hourly rate is ₹${rate}. Located in ${loc}. Owner is ${ownerName}.`)}
                          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-md transition-transform active:scale-95"
                          title="Listen audio details" type="button"
                        >
                          <span className="material-symbols-outlined text-lg">volume_up</span>
                        </button>
                      </div>
                      <div className="p-5 flex flex-col gap-3.5">
                        <h2 className="font-headline-lg text-on-surface font-bold text-lg leading-tight">{title}</h2>
                        <div className="bg-surface-container-low/70 p-3.5 rounded-2xl flex items-center justify-between border border-surface-container/60">
                          <div>
                            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Hourly Rate</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="font-headline-lg text-primary font-bold text-2xl">₹{rate}</span>
                              <span className="text-xs text-on-surface-variant font-medium">/ hr</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-secondary bg-secondary-container/80 px-2.5 py-0.5 rounded-md">{m.rentalUnit || 'HOURLY'}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-surface-container/50">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center shadow-xs">{ownerName[0]}</div>
                            <div className="flex flex-col">
                              <span className="font-label-md text-on-surface font-bold text-xs">{ownerName}</span>
                              <span className="text-secondary text-xs font-semibold">{rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                      {phone && (
                        <a className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-surface-container hover:bg-surface-variant text-primary font-label-md font-bold transition-all min-h-[48px] text-xs" href={`tel:${phone}`}>
                          <span className="material-symbols-outlined text-lg">call</span>
                          <span>Call Owner</span>
                        </a>
                      )}
                      <Link
                        to={`/equipment/${m.id}`}
                        className={`flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-sm transition-all min-h-[48px] text-xs ${!phone ? 'col-span-2' : ''}`}
                      >
                        <span className="material-symbols-outlined text-lg">event_available</span>
                        <span>View &amp; Rent</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback static cards when API has no data yet
              machines.map((m) => (
              <div
                key={m.id}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-surface-container hover:border-primary/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container with non-colliding badges */}
                  <div className="relative w-full h-60 bg-surface-container overflow-hidden">
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      alt={m.title}
                      src={m.photo}
                    />

                    {/* Left badge */}
                    <div className="absolute top-3 left-3 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm">speed</span>
                      <span className="truncate max-w-[120px]">{m.badge}</span>
                    </div>

                    {/* Right badge */}
                    <div className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="truncate max-w-[130px]">{m.status}</span>
                    </div>

                    {/* Bottom distance pill */}
                    <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-amber-400 text-sm">location_on</span>
                      <span>{m.loc}</span>
                    </div>

                    {/* Voice audio button */}
                    <button
                      onClick={() => speak(`${m.title}. Hourly rate is ${m.rate}. Located in ${m.loc}. Owner is ${m.owner}.`)}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-md transition-transform active:scale-95"
                      title="Listen audio details"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">volume_up</span>
                    </button>
                  </div>

                  {/* Card Content with ample padding */}
                  <div className="p-5 flex flex-col gap-3.5">
                    <div>
                      <h2 className="font-headline-lg text-on-surface font-bold text-lg sm:text-xl leading-tight">
                        {m.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {m.driverIncluded && (
                          <span className="inline-flex items-center gap-1 text-primary bg-secondary-container/40 px-2.5 py-1 rounded-md text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">person_check</span>
                            Driver Included
                          </span>
                        )}
                        {m.dieselIncluded && (
                          <span className="inline-flex items-center gap-1 text-secondary bg-surface-container px-2.5 py-1 rounded-md text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">local_gas_station</span>
                            Diesel Included
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Clear, Non-Overlapping Price Box */}
                    <div className="bg-surface-container-low/70 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-surface-container/60">
                      <div>
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                          Hourly Rate
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-headline-lg text-primary font-bold text-2xl">
                            {m.rate}
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium">/ hr</span>
                        </div>
                      </div>

                      <div className="sm:text-right border-t sm:border-t-0 pt-1.5 sm:pt-0 border-surface-container">
                        <span className="inline-block text-xs font-bold text-secondary bg-secondary-container/80 px-2.5 py-0.5 rounded-md">
                          {m.dayRate}
                        </span>
                        <span className="block text-[11px] text-on-surface-variant mt-0.5 font-medium">
                          {m.shift}
                        </span>
                      </div>
                    </div>

                    {/* Owner & Trust details */}
                    <div className="flex items-center justify-between pt-1 border-t border-surface-container/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center shadow-xs">
                          {m.owner[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-on-surface font-bold text-xs sm:text-sm">
                            {m.owner}
                          </span>
                          <span className="text-secondary text-xs font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>
                            <strong>{m.rating}</strong> • {m.trips}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions with robust touch sizes */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                  <a
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-surface-container hover:bg-surface-variant text-primary font-label-md font-bold transition-all min-h-[48px] text-xs"
                    href={`tel:${m.phone}`}
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    <span>Call Owner</span>
                  </a>
                  <Link
                    to={`/equipment/${m.id}`}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold shadow-sm transition-all min-h-[48px] text-xs"
                  >
                    <span className="material-symbols-outlined text-lg">event_available</span>
                    <span>View &amp; Rent</span>
                  </Link>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Guarantee Banner */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-surface-container shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">handshake</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-md text-primary font-bold text-base sm:text-lg">
                  Parijat Farmer Security Guarantee
                </h3>
                <p className="font-body-md text-on-surface-variant text-xs sm:text-sm">
                  Do not pay in advance. Your rental money is transferred to the machine owner only after your farm work is completed satisfactorily.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-secondary bg-secondary-container px-3.5 py-1.5 rounded-full">
                100% Cash / UPI on Completion
              </span>
            </div>
          </div>

        </div>

        {/* Audio Modal Dialog */}
        {audioModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 border border-surface-container">
              <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl animate-bounce">graphic_eq</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-headline-lg text-primary font-bold text-lg">
                  Parijat Audio Assistant
                </h4>
                <p className="text-sm text-on-surface mt-1 leading-relaxed">
                  "Hello farmer friends! 14 tractors and equipment are available around {villageName}. Tap any card to book a machine with an experienced driver."
                </p>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-2/3 rounded-full animate-pulse"></div>
              </div>
              <button
                onClick={() => {
                  stop();
                  setAudioModalOpen(false);
                }}
                className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md font-bold min-h-[44px]"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
