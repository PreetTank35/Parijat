import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';

export const MyBookingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { speak } = useVoice();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'MINE' | 'INCOMING'>('MINE');
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Review modal state
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [mineRes, incomingRes] = await Promise.all([
        api.getMyBookings(),
        api.getIncomingBookings(),
      ]);
      setMyBookings(mineRes.data || []);
      setIncomingBookings(incomingRes.data || []);
    } catch (err) {
      console.warn('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleStatusUpdate = async (id: string, status: string, reason?: string) => {
    setActionLoadingId(id);
    try {
      await api.updateBookingStatus(id, status, reason);
      await fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) return;
    setSubmittingReview(true);
    try {
      await api.createReview({
        bookingId: reviewBookingId,
        rating,
        comment,
      });
      setReviewBookingId(null);
      setComment('');
      await fetchBookings();
      alert('Your review has been submitted. Thank you!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const playVoiceOverview = () => {
    const text =
      activeTab === 'MINE'
        ? `You have ${myBookings.length} machinery bookings. Check status, owner contacts, or cancel if needed.`
        : `You have ${incomingBookings.length} incoming rental requests for your machinery. You can accept or decline each.`;
    speak(text);
  };

  const displayedList = activeTab === 'MINE' ? myBookings : incomingBookings;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Confirmed
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
            Awaiting Approval
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-bold">
            <span className="material-symbols-outlined text-sm">task_alt</span>
            Completed
          </span>
        );
      case 'CANCELLED':
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
            <span className="material-symbols-outlined text-sm">cancel</span>
            {status === 'CANCELLED' ? 'Cancelled' : 'Declined'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md">
            {status}
          </span>
        );
    }
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-12">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-space-lg">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
              My Machinery Bookings
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Track your rented machinery status, communicate with machine owners, and manage incoming requests.
            </p>
          </div>
          <button
            onClick={playVoiceOverview}
            type="button"
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-lg shadow-sm hover:bg-tertiary-fixed-dim transition-all"
          >
            <span className="material-symbols-outlined text-xl text-tertiary">volume_up</span>
            <span>Listen Status</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-surface-container-low p-1.5 rounded-2xl flex border border-surface-container mb-space-lg">
          <button
            onClick={() => setActiveTab('MINE')}
            className={`flex-1 py-3 text-label-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'MINE'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-xl">agriculture</span>
            <span>Equipment I Rented ({myBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('INCOMING')}
            className={`flex-1 py-3 text-label-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'INCOMING'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-xl">inbox</span>
            <span>Incoming Rental Requests ({incomingBookings.length})</span>
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-surface-container-lowest rounded-xl h-48 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : displayedList.length > 0 ? (
          <div className="space-y-space-md">
            {displayedList.map((booking) => {
              const title =
                i18n.language === 'mr' && booking.listing?.titleMr
                  ? booking.listing.titleMr
                  : booking.listing?.titleEn || 'Agricultural Machinery';

              const isMine = activeTab === 'MINE';
              const counterparty = isMine ? booking.listing?.owner : booking.renter;
              const photo =
                booking.listing?.images?.[0]?.url ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAFKqKL4Th61hGqAVIIR9LyKKewj3llLLlKflyAwqO5N8EM00_gvEnbQzx4sKpxIplPuI-A2bDHUhAgfVIbfTTQgTCNRskaKgpn6p8gi3wZJN7Le24AsbMMR2E5hk806PNdGzOhDV-MpmgSwphd7xVQ0B1KeLGWKs3HtS7SRFCr49e193MPU1nfYfHlqWHZ9Fjw_QAS7v80ynvIa8WQPKgVM8aPZLXXNgcxqVp1pXyGbdzzZ-mMxgg5IA';

              return (
                <div
                  key={booking.id}
                  className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm hover:shadow-md transition-shadow border border-surface-container-low"
                >
                  {/* Top Bar: Reference Code & Status */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md bg-surface-container-high px-2.5 py-1 rounded-full font-mono text-on-surface">
                        #{booking.bookingNumber || booking.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-body-md text-on-surface-variant text-xs">
                        Requested on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Machinery Preview & Schedule */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={photo}
                        alt={title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-surface-container"
                      />
                      <div>
                        <h3 className="font-headline-md text-headline-md text-primary font-bold">
                          {title}
                        </h3>
                        <p className="font-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                          <span className="material-symbols-outlined text-base text-secondary">calendar_today</span>
                          {new Date(booking.startDate).toLocaleDateString()}
                          {booking.totalUnits && ` • ${booking.totalUnits} Units`}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="font-headline-lg text-headline-lg text-primary font-bold block">
                        ₹{booking.totalAmount?.toLocaleString() || '0'}
                      </span>
                      <span className="font-label-md text-label-md text-secondary font-semibold">
                        Pay upon completion
                      </span>
                    </div>
                  </div>

                  {/* Counterparty & Actions */}
                  <div className="pt-3 border-t border-surface-container flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
                      <span className="material-symbols-outlined text-primary text-lg">person</span>
                      <span>
                        {isMine ? 'Owner' : 'Farmer'}: <strong className="text-on-surface">{counterparty?.name || 'Verified Farmer'}</strong>
                      </span>
                      {counterparty?.phone && (
                        <a
                          href={`tel:${counterparty.phone}`}
                          className="ml-2 px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-variant text-primary font-bold flex items-center gap-1 text-xs"
                        >
                          <span className="material-symbols-outlined text-xs">call</span>
                          {counterparty.phone}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isMine && booking.status === 'REQUESTED' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'ACCEPTED')}
                            disabled={actionLoadingId === booking.id}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold shadow-sm flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'REJECTED', 'Machine currently unavailable')}
                            disabled={actionLoadingId === booking.id}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-error-container text-on-error-container font-label-md font-bold flex items-center justify-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                            Decline
                          </button>
                        </>
                      )}

                      {!isMine && booking.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                          disabled={actionLoadingId === booking.id}
                          className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Mark as Completed
                        </button>
                      )}

                      {isMine && booking.status === 'REQUESTED' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'CANCELLED', 'Cancelled by farmer')}
                          disabled={actionLoadingId === booking.id}
                          className="text-error hover:underline font-label-md font-semibold px-2"
                        >
                          Cancel Request
                        </button>
                      )}

                      {isMine && booking.status === 'COMPLETED' && (
                        <button
                          onClick={() => setReviewBookingId(booking.id)}
                          className="px-4 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md font-bold shadow-sm flex items-center gap-1 hover:bg-tertiary-fixed-dim"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          Rate Equipment
                        </button>
                      )}

                      {isMine && (
                        <Link
                          to={`/book/${booking.listingId}?confirmed=true`}
                          className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-variant text-primary font-label-md font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">receipt_long</span>
                          View Receipt
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center border-2 border-dashed border-outline-variant shadow-sm">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">event_busy</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-1">
              {activeTab === 'MINE' ? 'No Machinery Bookings Yet' : 'No Incoming Rental Requests'}
            </h3>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
              {activeTab === 'MINE'
                ? 'Explore nearby tractors, harvesters, rotavators, and sprayers available for rent in your taluka.'
                : 'When nearby farmers need equipment, requests will appear here for your one-click approval.'}
            </p>
            {activeTab === 'MINE' && (
              <Link
                to="/equipment"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all"
              >
                <span className="material-symbols-outlined">agriculture</span>
                Browse Available Equipment
              </Link>
            )}
          </div>
        )}

        {/* Review Modal */}
        {reviewBookingId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container">
              <h3 className="font-headline-lg text-primary font-bold mb-1">Rate Equipment & Owner</h3>
              <p className="font-body-md text-on-surface-variant mb-4">
                Your feedback helps fellow farmers select verified and well-maintained machinery.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex justify-center gap-3 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-3xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span className={star <= rating ? 'text-amber-500' : 'text-outline-variant'}>★</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block font-label-lg text-on-surface mb-1">Your Review / Comments</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Machine arrived right on time, well-maintained and fuel efficient..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-outline-variant bg-surface-container-low font-body-md focus:bg-surface-container-lowest focus:border-primary outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBookingId(null)}
                    className="flex-1 py-3 rounded-full border border-outline font-label-lg text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
