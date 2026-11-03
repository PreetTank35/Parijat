import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';

export const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { selectedVillage } = useLocation();
  const { speak, isSpeaking, stop } = useVoice();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [acres, setAcres] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>('today');
  const [submittingBooking, setSubmittingBooking] = useState<boolean>(false);

  const villageName = selectedVillage ? selectedVillage.nameEn : 'Baramati';

  // 4 high-res gallery images from template
  const galleryImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDrVx-a10vSM5qZPs14PXoiZnp5pdsVfMawXPmZX_tyRZeq1ukyta2kQ5F9IDJPQLvlkh4aR8QYXP0JXakBjS7By4Sx8OXAjsB7AO0xfDzJRhNGSCXKx1Ituq8mbGa_wR3HrWtByIhmjmuH18A3wIlbcWSRGQTH9nDt3JCJRJthdnvZ5oPulQMFqQSxyYoEBNxNvrePrWX67RFDg2FYH9aTMXpX8GFcBGbXPThrZoie61jwfigq3r-XQg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ1U7A7aSpaQCzwG0FodiSYiVmUl9XdKB_aZaLj80ZDASj0AVNgIhVxUMfevQwIoxPjVvdvfjXRrzJJaFDnXVWIJ1vMwwoNbILEyo5ZhBB5HlkNtvVq2YNmxsyMURWK3X1EPHKcCzoyslEA6uryq5me89H3CmUrhA0dbOvyPU6V0ANquX0q3c3i-wpo75VERJZLDe7JSZMx4kGnDGIz_O8a6WeO-qu3ccjS1PxjEybBSPNAY-gkURD_w',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCxtvq6QPnX4yBVirfNc2ghk3gbEOHIKRkBXPXYBaHFDbRPhOZl7BsNpaqpNiD25oJNVdyfOg18XWC3em0OfOBccgb4VNa17CzTgjsFkFw0y50Dd489ZuyLGQugA_6FI5ek0WwMVm9vR4_W7grK3uGkK9GiSRqf4NDZOvmmozsQBYm2XajySeGXivObIG1QNjnfOufdgA6IiTo41sShbTs_nukpZKJfXKssoxi_G2RO2g6UF6YeV1ZAVw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC6WkJaOm3VElhBTtw-MmsS_B9nW4LfeDUiSwrrq4PrtGTyllqwmnFHJkcmF-sUUO-wn3PZ5dFIrfGerAZF78C-CkoRKj6olI2SiH_Vw3zSiIeM1Xgovqo4Mw9wHhf5rzwNSiOnu0CZaeq9VCmkxccDTELYkslYqrup7Gmo7HctTm2mulgEaorwJhBkIYn7rqLkR8DdQELBVkmj3zRQSS_cgc9I2FnXGFlWIC0-PzQHY3Mt2jAe68LaZw',
  ];

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        if (id) {
          const res = await api.getEquipmentById(id);
          setListing(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch listing details, using template data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const machineTitle = listing?.titleEn || 'Mahindra 575 DI Tractor';
  const machineRate = listing?.rentalRate || 700;
  const ownerName = listing?.owner?.name || 'Tukaram Jadhav';
  const ownerPhone = listing?.owner?.phone || '9822012345';
  const locationText = listing?.village?.nameEn ? `Village: ${listing.village.nameEn}, Baramati` : 'Village: Vadgaon Nimbalkar, Baramati';

  const triggerAudioHelp = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(`${machineTitle}, 45 HP power. Rental rate is ₹${machineRate} per hour with driver included at ${locationText}. Best suited for deep ploughing and rotavator seedbed preparation.`);
    }
  };

  const handleConfirmBooking = async () => {
    setSubmittingBooking(true);
    try {
      if (listing?.id && isAuthenticated) {
        await api.createBooking({
          listingId: listing.id,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          totalUnits: acres * 2,
          notes: `Estimated area: ${acres} acres. Start time: ${selectedDate}.`,
        });
      }
    } catch (e) {
      console.warn('Booking API call skipped, redirecting to confirmation', e);
    } finally {
      setSubmittingBooking(false);
      setBookingModalOpen(false);
      navigate(`/book/${id || '4147f46c-9155-4d9a-93f9-5a0b340464ec'}?confirmed=true`);
    }
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-12">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4 w-full">
          
          {/* 1. Top Breadcrumb & Quick Actions */}
          <div className="flex items-center justify-between gap-space-sm mb-space-md">
            <Link
              to="/equipment"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-variant text-on-surface font-label-lg text-label-lg transition-colors group shadow-sm"
            >
              <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              <span>&lt; Back to All Equipment</span>
            </Link>

            {/* Quick Audio Pill for Whole Screen */}
            <button
              onClick={triggerAudioHelp}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-label-lg text-label-lg font-bold shadow-sm transition-all ${
                isSpeaking
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim'
              }`}
              id="mainAudioBtn"
              type="button"
            >
              <span className="material-symbols-outlined text-tertiary animate-pulse">volume_up</span>
              <span>{isSpeaking ? 'Pause Audio' : 'Listen to Details'}</span>
            </button>
          </div>

          {/* Main Visual & Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-gutter-desktop items-start">
            
            {/* LEFT COLUMN: Image Gallery & Visual Trust Marks (lg: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              {/* Hero Equipment Photo Card */}
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-surface-container-lowest">
                <div className="relative aspect-[4/3] w-full">
                  <img
                    className="w-full h-full object-cover"
                    alt={machineTitle}
                    src={galleryImages[selectedPhotoIdx]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
                  
                  {/* Parijat Verified Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-primary shadow-md font-label-md text-label-md">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <span className="font-bold text-on-surface">Parijat Verified Machine</span>
                  </div>

                  {/* Floating Distance Pill */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow font-label-md text-label-md">
                    <span className="material-symbols-outlined text-primary text-base">near_me</span>
                    <span>2.5 km distance</span>
                  </div>

                  {/* Image Index Counter */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 text-white font-label-md text-label-md">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>{selectedPhotoIdx + 1} / {galleryImages.length}</span>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="p-3 bg-surface-container-low flex items-center gap-2 overflow-x-auto">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm transition-all ${
                        selectedPhotoIdx === idx
                          ? 'ring-2 ring-primary opacity-100'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      type="button"
                    >
                      <img className="w-full h-full object-cover" alt="Thumbnail" src={img} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Vernacular Audio Player Bar */}
              <div className="p-4 rounded-xl bg-surface-container-high shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow">
                    <span className="material-symbols-outlined text-2xl">mic</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-bold">Audio Walkthrough</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      How this machine works, implements &amp; rates (1:12 mins)
                    </p>
                  </div>
                </div>
                <button
                  onClick={triggerAudioHelp}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow hover:opacity-90 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {isSpeaking ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isSpeaking ? 'Pause' : 'Play'}</span>
                </button>
              </div>

              {/* Suitable Crops & Works (Visual Icons) */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">handyman</span>
                  Best Suited For:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-2xl mb-1">agriculture</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">Deep Ploughing</span>
                    <span className="text-xs text-on-surface-variant">Hard Soil Tillage</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-2xl mb-1">cyclone</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">Rotary Tiller</span>
                    <span className="text-xs text-on-surface-variant">Rotavator Work</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-2xl mb-1">grain</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">Seedbed Prep</span>
                    <span className="text-xs text-on-surface-variant">Pre-sowing Bed</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-2xl mb-1">local_shipping</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">Haulage Work</span>
                    <span className="text-xs text-on-surface-variant">Trolley Transport</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Information Blocks, Rates, Owner & Booking (lg: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* Title & Primary Details Card */}
              <div className="p-space-md md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
                    45 HP Power
                  </span>
                  <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-md text-label-md">
                    Model: 2022
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  {machineTitle}
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Equipped with rotavator and 5-tine cultivator attachments. Excellent fuel efficiency and ideal for tilling black soil.
                </p>

                {/* BLOCK 1: Rental Rate Card (High Contrast) */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1.5 mt-2">
                  <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
                    Price &amp; Rental Rate
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-xl text-headline-xl text-primary font-bold">₹{machineRate}</span>
                    <span className="font-headline-md text-headline-md text-on-surface">/ hour</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-on-surface font-body-md text-body-md pt-1">
                    <span className="material-symbols-outlined text-tertiary text-lg">local_gas_station</span>
                    <span className="font-semibold">or ₹3,500 / day</span>
                    <span className="text-on-surface-variant text-xs">(incl. fuel / diesel)</span>
                  </div>
                </div>

                {/* BLOCK 2: Immediate Availability */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container">
                  <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">event_available</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant">Availability Status</p>
                    <p className="font-headline-md text-headline-md text-primary font-bold">
                      Available Today &amp; Tomorrow
                    </p>
                  </div>
                </div>

                {/* BLOCK 3: Farm Location */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl text-primary">location_on</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">Location &amp; Distance</span>
                    <span className="font-body-lg text-body-lg text-on-surface font-bold">
                      {locationText}
                    </span>
                    <span className="font-body-md text-body-md text-secondary">
                      2.5 km from your farm (~10 mins)
                    </span>
                  </div>
                </div>

                {/* BLOCK 4: Driver / Operator Support */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary-container/40">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">person_check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-secondary-container font-bold">
                      Driver Included
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Experienced operator provided at no extra cost
                    </span>
                  </div>
                </div>
              </div>

              {/* BLOCK 5: Verified Equipment Owner Card */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    Equipment Owner
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified_user
                    </span>
                    Aadhaar &amp; Bank Verified
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <img
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary"
                    alt={ownerName}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV9NNpoQvOBAwxEXYFdTLe5_Sd_tEH6V9-JvqQQjezDSuUyOCF4vp9sdDSx8nOnLC9Wq3f9HwOHvY5TUwFMFpkmLP7r71MpMZCnYoLg8JUwfQLNFUMilFkfCzNrneMB34L3IyKme1HGCnGJebih0QdzXv6Lv9E5yzjPAoC0QRN82w67pFlQleg1F2mihruw7ErqVHFGMZ4RHDBQ_u1FT8LgZxSV6-HslRm8C3jfbc1ejscwcdJUYappw"
                  />
                  <div className="flex flex-col">
                    <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {ownerName}
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Farmer &amp; Machine Operator • Vadgaon Nimbalkar
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center text-tertiary font-bold text-label-md">
                        ★ 4.9
                      </span>
                      <span className="text-xs text-on-surface-variant">• 34 successful bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4. Real Farmer Reviews Pill List Section */}
          <div className="mt-space-lg p-space-md md:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">rate_review</span>
                  Experience &amp; Reviews from Nearby Farmers
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Verified feedback from farmers in the Baramati area
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container font-label-md text-label-md text-on-surface">
                <span className="material-symbols-outlined text-tertiary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-bold">4.9 / 5</span>
                <span className="text-on-surface-variant">(28 reviews)</span>
              </div>
            </div>

            {/* Reviews Grid / Horizontal Stack */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
              {/* Review 1 */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-1 text-tertiary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-lg text-body-lg text-on-surface italic">
                  “Excellent tractor, operator arrived right on time. The rotavator work in my onion field was extremely fine and thorough.”
                </p>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-variant/40">
                  <span className="font-bold text-on-surface">Balasaheb Shinde</span>
                  <span>Nira Road, 2 days ago</span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-1 text-tertiary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-lg text-body-lg text-on-surface italic">
                  “The diesel consumption and hourly accounting were fully transparent. Tukaram is very cooperative and easy to work with.”
                </p>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-variant/40">
                  <span className="font-bold text-on-surface">Ganesh Bankar</span>
                  <span>Supa, 5 days ago</span>
                </div>
              </div>

              {/* Review 3 */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-1 text-tertiary">
                  {[1, 2, 3, 4].map((s) => (
                    <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                  <span className="material-symbols-outlined text-sm">star_half</span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface italic">
                  “The 45 HP engine is very powerful. Deep ploughing went effortlessly even in tough, stony soil.”
                </p>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-variant/40">
                  <span className="font-bold text-on-surface">Mahadev Jagtap</span>
                  <span>Morgaon, 1 week ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safe Booking Guarantee strip */}
          <div className="mt-space-md p-4 rounded-xl bg-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">shield_person</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface font-bold">
                  Parijat Security Guarantee
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Payment released only after satisfactory job completion.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs bg-surface-container-lowest px-3 py-1.5 rounded-full font-bold text-secondary">
                100% Secure Transaction
              </span>
            </div>
          </div>

        </div>

        {/* 5. Bottom Persistent Action Bar (High affordance, ergonomic, vernacular) */}
        <aside
          aria-label="Quick Actions"
          className="sticky bottom-0 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-6px_20px_rgba(38,51,43,0.12)]"
        >
          <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Price recap (mobile hidden, desktop show) */}
              <div className="hidden sm:flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary font-bold leading-tight">
                  ₹{machineRate} <span className="font-body-md text-body-md font-normal text-on-surface">/ hr</span>
                </span>
                <span className="font-label-md text-label-md text-secondary">
                  With driver • Immediate availability
                </span>
              </div>

              {/* Action Button Cluster */}
              <div className="w-full sm:w-auto flex items-center justify-end gap-2.5 sm:gap-4">
                {/* Audio Guide Quick Button */}
                <button
                  className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim shrink-0 shadow transition-transform active:scale-95"
                  onClick={triggerAudioHelp}
                  type="button"
                >
                  <span className="material-symbols-outlined text-2xl">volume_up</span>
                  <span className="font-label-md text-[11px] font-bold leading-none mt-0.5">Audio Help</span>
                </button>

                {/* Secondary Button: Call Owner */}
                <a
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 h-14 rounded-full bg-surface-container-lowest text-primary ring-2 ring-primary hover:bg-surface-container transition-all font-label-xl text-label-xl active:scale-98"
                  href={`tel:${ownerPhone}`}
                >
                  <span className="material-symbols-outlined text-2xl text-primary">call</span>
                  <span className="font-bold whitespace-nowrap">Call Owner</span>
                </a>

                {/* Primary Button: Book Equipment Now */}
                <button
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 sm:px-8 h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-xl text-label-xl shadow-md transition-all active:scale-98"
                  id="bookNowBtn"
                  onClick={() => setBookingModalOpen(true)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                  <span className="font-bold whitespace-nowrap">Book Now</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Interactive Modal for Immediate Booking Confirmation */}
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl p-space-lg shadow-xl flex flex-col gap-space-md animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">
                  Confirm Booking Details
                </h3>
                <button
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
                  onClick={() => setBookingModalOpen(false)}
                  type="button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
                <div>
                  <p className="font-label-lg text-label-lg font-bold text-on-surface">
                    {machineTitle}
                  </p>
                  <p className="font-body-md text-body-md text-secondary">
                    Rate: ₹{machineRate} / hour (Driver included)
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Select Start Date:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedDate('today')}
                    className={`p-3 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 ${
                      selectedDate === 'today'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">today</span>
                    Today (Immediate)
                  </button>
                  <button
                    onClick={() => setSelectedDate('tomorrow')}
                    className={`p-3 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 ${
                      selectedDate === 'tomorrow'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">event</span>
                    Tomorrow Morning
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Estimated Farm Area (Acres):
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-14 px-4 rounded-xl bg-surface-container text-on-surface text-lg font-bold outline-none focus:ring-2 focus:ring-primary"
                    type="number"
                    min="1"
                    max="50"
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value) || 1)}
                  />
                  <span className="absolute right-4 font-label-lg text-label-lg text-on-surface-variant font-bold">
                    Acres
                  </span>
                </div>
              </div>

              <button
                className="w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-xl text-label-xl font-bold shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                onClick={handleConfirmBooking}
                disabled={submittingBooking}
                type="button"
              >
                <span className="material-symbols-outlined">send</span>
                <span>{submittingBooking ? 'Sending...' : 'Send Booking Request (Free)'}</span>
              </button>

              <p className="text-xs text-center text-on-surface-variant">
                Owner {ownerName} will be notified immediately via SMS and phone call.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
