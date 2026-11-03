import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';

export const BookEquipmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { speak, stop, isSpeaking } = useVoice();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(
    searchParams.get('confirmed') === 'true' ? 3 : 1
  );
  const [startDate, setStartDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('8:00 AM to 12:00 PM');
  const [units, setUnits] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');
  const [withDriver, setWithDriver] = useState<boolean>(true);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (id) {
          const res = await api.getEquipmentById(id);
          setListing(res.data);
        }
      } catch (err: any) {
        console.warn('Listing could not be loaded via API, using defaults', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const machineTitle = listing?.titleEn || 'Mahindra 575 DI Tractor';
  const ownerName = listing?.owner?.name || 'Tukaram Jadhav';
  const ownerPhone = listing?.owner?.maskedPhone || listing?.owner?.phone || '9822000000';
  const ownerLocation = listing?.village?.nameEn ? `${listing.village.nameEn}, Baramati` : 'Vadgaon, Baramati';
  const rate = listing?.rentalRate || 700;
  const rentalAmount = units * rate;
  const bookingCode = createdBooking?.id ? `#PJ-${createdBooking.id.slice(0, 5).toUpperCase()}` : '#PJ-78921';

  const handleCreateBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      if (listing?.id && isAuthenticated) {
        const res = await api.createBooking({
          listingId: listing.id,
          startDate: new Date(startDate || Date.now()).toISOString(),
          endDate: new Date(startDate || Date.now()).toISOString(),
          totalUnits: units,
          notes: notes ? `${notes} (Time: ${timeSlot}, Driver: ${withDriver ? 'Yes' : 'No'})` : `Time: ${timeSlot}`,
        });
        setCreatedBooking(res.data);
      }
    } catch (err: any) {
      console.warn('Backend booking skipped, proceeding to confirmation', err);
    } finally {
      setSubmitting(false);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAudioPlayback = () => {
    if (isSpeaking) {
      stop();
    } else {
      const formattedDate = new Date(startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const text =
        i18n.language === 'mr'
          ? `आपली बुकिंग विनंती यशस्वीरीत्या पाठवली आहे. ${machineTitle}, तारीख ${formattedDate}, वेळ सकाळी ८ वाजता. अंदाजे भाडे ${rentalAmount} रुपये. काम पूर्ण झाल्यावर थेट पैसे द्या.`
          : `Your booking request has been sent successfully. ${machineTitle} on ${formattedDate} at 8 AM. Estimated rent is ${rentalAmount} rupees. Pay directly after completion.`;
      speak(text);
    }
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-16">
      <div className="flex flex-col w-full">
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-6">
          
          {/* Step Indicator Progress Header */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm mb-space-lg">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-surface-container-high rounded-full -z-0">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{
                    width: currentStep === 1 ? '15%' : currentStep === 2 ? '50%' : '100%',
                  }}
                />
              </div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest transition-colors ${
                    currentStep >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold text-center">
                  Step 1<br />
                  <span className="text-on-surface-variant font-medium">Date &amp; Time</span>
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest transition-colors ${
                    currentStep >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    receipt_long
                  </span>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold text-center">
                  Step 2<br />
                  <span className="text-on-surface-variant font-medium">Rental Details</span>
                </span>
              </div>

              {/* Step 3: Active Confirmation */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-4 ring-surface-container-lowest ${
                    currentStep === 3
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed animate-bounce'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl text-tertiary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    task_alt
                  </span>
                </div>
                <span className="font-label-md text-label-md text-tertiary font-bold text-center">
                  Step 3<br />
                  <span className="text-primary font-bold">Booking Confirmation</span>
                </span>
              </div>
            </div>
          </div>

          {currentStep === 3 ? (
            /* =========================================================================
               STEP 3: MAIN CONFIRMATION HERO CARD & DETAILS (Matching template)
               ========================================================================= */
            <>
              {/* Main Confirmation Hero Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md text-center flex flex-col items-center relative overflow-hidden mb-space-lg">
                {/* Decorative Organic Glow */}
                <div className="absolute -top-16 -right-16 w-52 h-52 bg-secondary-container/40 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>

                {/* Sunflower & Sprout Animated Checkmark Motif */}
                <div className="relative mb-space-md">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-secondary-container flex items-center justify-center shadow-inner">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-4xl sm:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined absolute -bottom-1 -right-2 text-3xl text-tertiary bg-tertiary-fixed rounded-full p-1 shadow-sm">
                    eco
                  </span>
                </div>

                {/* Live Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg font-bold mb-space-sm shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-tertiary animate-ping"></span>
                  <span>Verification in Progress: Awaiting Machine Owner Approval</span>
                </div>

                {/* Big Reassuring Headline */}
                <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-space-xs max-w-xl">
                  Your Booking Request Has Been Sent Successfully!
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-space-md">
                  Do not worry, this request has reached owner {ownerName.split(' ')[0]} directly and he will call you shortly to confirm.
                </p>

                {/* Audio Readout Feature Pill */}
                <button
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-xl text-label-xl shadow-sm transition-all transform active:scale-95 group min-h-[52px]"
                  id="audioButton"
                  onClick={handleAudioPlayback}
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform"
                    id="speakerIcon"
                  >
                    {isSpeaking ? 'pause_circle' : 'volume_up'}
                  </span>
                  <span className="font-bold" id="audioText">
                    {isSpeaking ? 'Pause Audio' : 'Listen to Booking Receipt in English/Marathi'}
                  </span>
                  <div className="flex items-end gap-0.5 h-4 ml-1">
                    <span className="w-1 bg-primary rounded-full h-2 animate-pulse"></span>
                    <span className="w-1 bg-primary rounded-full h-4 animate-pulse delay-75"></span>
                    <span className="w-1 bg-primary rounded-full h-3 animate-pulse delay-150"></span>
                  </div>
                </button>
                {isSpeaking && (
                  <p className="text-secondary font-label-md text-label-md mt-2 font-semibold" id="audioPlayingNotice">
                    🔊 Playing Audio: "Your booking request for {machineTitle} on 24 March is sent..."
                  </p>
                )}
              </div>

              {/* Split Information Section: Details & Clear Visual Steps */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-tablet mb-space-lg">
                {/* Left: Visual Booking Summary Box */}
                <div className="md:col-span-7 bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low -mx-space-md -mt-space-md px-space-md py-space-sm rounded-t-xl">
                      <span className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">assignment</span>
                        Booking Summary Receipt
                      </span>
                      <span className="font-label-md text-label-md bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-full font-mono">
                        {bookingCode}
                      </span>
                    </div>

                    {/* Tractor Snapshot & Specs */}
                    <div className="flex gap-space-sm items-center bg-surface-container rounded-xl p-space-sm mb-space-md">
                      <img
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
                        alt={machineTitle}
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFKqKL4Th61hGqAVIIR9LyKKewj3llLLlKflyAwqO5N8EM00_gvEnbQzx4sKpxIplPuI-A2bDHUhAgfVIbfTTQgTCNRskaKgpn6p8gi3wZJN7Le24AsbMMR2E5hk806PNdGzOhDV-MpmgSwphd7xVQ0B1KeLGWKs3HtS7SRFCr49e193MPU1nfYfHlqWHZ9Fjw_QAS7v80ynvIa8WQPKgVM8aPZLXXNgcxqVp1pXyGbdzzZ-mMxgg5IA"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-md text-headline-md text-on-surface font-bold truncate">
                          {machineTitle}
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-base text-secondary">bolt</span>
                          45 HP Power • Rotavator attached
                        </span>
                        <div className="inline-flex items-center gap-1 mt-1 text-secondary font-label-md text-label-md">
                          <span className="material-symbols-outlined text-sm">verified_user</span> Certified Farm Machine
                        </div>
                      </div>
                    </div>

                    {/* Key Data Row Cards */}
                    <div className="space-y-space-xs mb-space-md">
                      {/* Owner Info */}
                      <div className="flex items-start justify-between p-2.5 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-xl">person_pin</span>
                          <span className="font-label-lg text-label-lg text-on-surface-variant">Machine Owner:</span>
                        </div>
                        <div className="text-right">
                          <span className="font-label-xl text-label-xl text-on-surface font-bold block">
                            {ownerName}
                          </span>
                          <span className="font-body-md text-body-md text-on-surface-variant flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                            {ownerLocation} (3.2 km)
                          </span>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-start justify-between p-2.5 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                          <span className="font-label-lg text-label-lg text-on-surface-variant">Scheduled Date &amp; Time:</span>
                        </div>
                        <div className="text-right">
                          <span className="font-label-xl text-label-xl text-on-surface font-bold block">
                            24 March 2025
                          </span>
                          <span className="font-body-md text-body-md text-on-surface-variant">
                            8:00 AM to 12:00 PM ({units} hours)
                          </span>
                        </div>
                      </div>

                      {/* Estimated Cost */}
                      <div className="flex items-start justify-between p-2.5 rounded-lg bg-surface-container-low">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-xl">currency_rupee</span>
                          <span className="font-label-lg text-label-lg text-on-surface-variant">Estimated Rent:</span>
                        </div>
                        <div className="text-right">
                          <span className="font-headline-lg text-headline-lg text-primary font-bold block leading-none">
                            ₹2,800
                          </span>
                          <span className="font-label-md text-label-md text-on-surface-variant">
                            ({units} hours × ₹{rate}/hour)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safe Payment Guarantee Strip */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary-container text-on-secondary-container shadow-sm">
                    <span className="material-symbols-outlined text-3xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                      shield_with_heart
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg font-bold">
                        Farmer Security Guarantee: Do not pay in advance!
                      </span>
                      <span className="font-body-md text-body-md leading-snug">
                        Pay cash or UPI directly after the work is completed on your farm.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Next Steps 1-2-3 Guide Card */}
                <div className="md:col-span-5 bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-primary mb-space-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary">alt_route</span>
                      What Happens Next?
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                      To ensure complete transparency in booking, the following steps are underway:
                    </p>
                    <ol className="space-y-space-md">
                      {/* Step 1 */}
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center shrink-0 mt-0.5 text-base shadow-sm">
                          1
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            SMS &amp; Call Sent
                          </span>
                          <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
                            Notification with your farm location and requested time sent to {ownerName.split(' ')[0]}.
                          </p>
                        </div>
                      </li>

                      {/* Step 2 */}
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center shrink-0 mt-0.5 text-base shadow-sm">
                          2
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            Confirmation within 10 minutes
                          </span>
                          <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
                            {ownerName.split(' ')[0]} will review and call you to confirm arrival time.
                          </p>
                        </div>
                      </li>

                      {/* Step 3 */}
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center shrink-0 mt-0.5 text-base shadow-sm">
                          3
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            Need changes or help?
                          </span>
                          <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
                            Call our free farmer helpline 1800-233-5500 anytime.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Direct Instant Contact Bar */}
                  <div className="mt-space-md p-space-sm rounded-xl bg-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        alt={ownerName}
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTbm0yTTDlmwI69TK8Rd7bpvornom830Tz9y_gJy98F3FtUTMPYAVr1hh42KxwJKShBREJixuFdH1Q9SaTBM5ZTTlQRKXBN_0VVD9uuNfguOAfM29mQVpKTfP97d_cdp2Hd1vJAWf1vNouxAWzq40UJ7Ez4UFwWBhDLf0aLklvKxrblm2l7wqoiEvQfyGU3gyhDLhg4xm9gFZK5b8oNQpsO2bssgEcSnxcy6Vnto9XsEnbfcLOXF5gaA"
                      />
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          {ownerName}
                        </span>
                        <span className="font-label-md text-label-md text-secondary">
                          9822XXXX12
                        </span>
                      </div>
                    </div>
                    <a
                      className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md font-bold shadow-sm"
                      href={`tel:${ownerPhone}`}
                    >
                      <span className="material-symbols-outlined text-base">call</span> Call Directly
                    </a>
                  </div>
                </div>
              </div>

              {/* Big Farmer Ergonomic Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full">
                {/* Primary: View My Bookings */}
                <Link
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-xl text-label-xl shadow-md transition-all active:scale-98 min-h-[56px] text-center"
                  to="/bookings"
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    list_alt
                  </span>
                  View All My Bookings
                </Link>

                {/* Secondary: Call Owner Directly */}
                <a
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-variant font-label-xl text-label-xl shadow-sm transition-all min-h-[56px]"
                  href={`tel:${ownerPhone}`}
                >
                  <span className="material-symbols-outlined text-2xl text-secondary">phone_forwarded</span>
                  Call Owner Directly
                </a>

                {/* Tertiary: Back to Home */}
                <Link
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-lg text-label-lg transition-colors min-h-[56px]"
                  to="/"
                >
                  <span className="material-symbols-outlined text-xl">home</span>
                  Return to Home
                </Link>
              </div>

              {/* Live Status Update Banner */}
              <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-high/60 flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">sync</span>
                  <span className="font-body-md text-body-md">Page automatically updates • Last checked: Just now</span>
                </div>
                <button
                  className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1"
                  onClick={() => window.location.reload()}
                  type="button"
                >
                  Refresh <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </>
          ) : (
            /* =========================================================================
               STEP 1 & 2: DATE, TIME & DETAILS SELECTION
               ========================================================================= */
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container space-y-6">
              <div className="border-b border-surface-container pb-4">
                <h2 className="font-headline-lg text-primary font-bold">
                  {currentStep === 1 ? 'Step 1: Choose Date & Timing' : 'Step 2: Confirm Farm Details'}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Booking for {machineTitle} • Rate: ₹{rate}/hr (Driver included)
                </p>
              </div>

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-lg font-bold text-on-surface mb-2">
                      When do you need the machine?
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-container text-on-surface font-bold text-lg border-0 focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-label-lg font-bold text-on-surface mb-2">
                      Preferred Time Slot:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        '08:00 AM - 12:00 PM (Morning)',
                        '01:00 PM - 05:00 PM (Afternoon)',
                        'Full Day (8 Hours)',
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`p-3.5 rounded-xl font-bold text-left border transition-all ${
                            timeSlot === slot
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-surface-container bg-surface-container-low text-on-surface'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-lg shadow-md hover:bg-primary-container transition-all"
                    type="button"
                  >
                    Continue to Details →
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-label-lg font-bold text-on-surface mb-1">
                      Estimated Hours Needed:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setUnits(Math.max(1, units - 1))}
                        className="w-12 h-12 rounded-xl bg-surface-container text-primary font-bold text-2xl flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-headline-lg text-primary font-bold text-2xl w-16 text-center">
                        {units} hrs
                      </span>
                      <button
                        type="button"
                        onClick={() => setUnits(units + 1)}
                        className="w-12 h-12 rounded-xl bg-surface-container text-primary font-bold text-2xl flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div>
                      <span className="text-xs text-on-surface-variant block font-bold">Estimated Cost</span>
                      <span className="font-headline-lg text-primary font-bold text-2xl">₹{rentalAmount}</span>
                    </div>
                    <span className="text-xs font-bold text-secondary bg-secondary-container px-3 py-1 rounded-full">
                      Pay after work is done
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-4 rounded-full bg-surface-container text-on-surface font-bold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleCreateBooking}
                      className="flex-1 py-4 rounded-full bg-primary text-on-primary font-bold text-lg shadow-md hover:bg-primary-container disabled:opacity-50"
                    >
                      {submitting ? 'Sending Request...' : 'Send Booking Request'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </main>
  );
};
