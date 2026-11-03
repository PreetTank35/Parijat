import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';

export const AuthPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { requestOtp, verifyOtp, quickLogin } = useAuth();
  const { speak } = useVoice();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoFarmers = [
    {
      name: 'Ramesh Shinde (रमेश शिंदे)',
      phone: '9822012345',
      role: 'Tractor Owner • Baramati',
      emoji: '🚜',
    },
    {
      name: 'Sanjay Patil (संजय पाटील)',
      phone: '9822023456',
      role: 'Harvester Owner • Junnar',
      emoji: '🌾',
    },
    {
      name: 'Ananda Kadam (आनंदा कदम)',
      phone: '9822034567',
      role: 'Water Pump Owner • Hinjawadi',
      emoji: '💧',
    },
    {
      name: 'Dnyaneshwar More (ज्ञानेश्वर मोरे)',
      phone: '9822045678',
      role: 'Farmer • Shirur',
      emoji: '👨‍🌾',
    },
  ];

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await requestOtp(phone);
      setStep('OTP');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP code. For demo, use 123456.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoPhone: string) => {
    setLoading(true);
    setError(null);
    try {
      await quickLogin(demoPhone);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceHelp = () => {
    speak('Parijat farmer sign in. Enter your phone number, or click on any farmer name below to sign in instantly.');
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-140px)] py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-md p-6 sm:p-8">
          
          {/* Brand & Speaker */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center text-xl shadow-xs">
                🌱
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-primary font-bold text-lg leading-tight">
                  Parijat
                </span>
                <span className="text-[11px] font-semibold text-secondary leading-tight">
                  Farmer Sign In
                </span>
              </div>
            </div>

            <button
              onClick={handleVoiceHelp}
              type="button"
              className="p-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors"
              title="Voice Help"
            >
              <span className="material-symbols-outlined text-lg text-tertiary">volume_up</span>
            </button>
          </div>

          <h1 className="font-headline-lg text-primary font-bold text-xl mb-1">
            Sign In with Mobile
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mb-5">
            Quick 1-time OTP verification. No password needed.
          </p>

          {error && (
            <div className="mb-4 bg-error-container text-on-error-container p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {step === 'PHONE' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Mobile Number (मोबाईल नंबर)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 font-bold text-on-surface-variant text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98220 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-13 pr-4 py-3 rounded-xl border border-outline-variant focus:border-primary font-headline-md text-on-surface bg-surface-container-low focus:bg-surface-container-lowest outline-none text-base font-bold transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-label-xl font-bold shadow-xs transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{loading ? 'Sending OTP...' : 'Send OTP via SMS'}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[0.5em] py-3 rounded-xl border-2 border-primary font-headline-xl text-primary bg-surface-container-lowest outline-none font-bold text-2xl"
                />
                <p className="text-xs text-secondary font-bold mt-1.5 text-center">
                  💡 Demo Code: Enter 123456
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-xl font-bold shadow-xs transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full text-center text-xs font-bold text-on-surface-variant hover:text-on-surface py-1"
              >
                ← Back to Mobile Number
              </button>
            </form>
          )}

          {/* 1-Click Fast Demo Login Profiles */}
          <div className="mt-6 pt-5 border-t border-surface-container">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-2.5">
              ⚡ Instant 1-Click Test Farmer Login
            </span>

            <div className="space-y-2">
              {demoFarmers.map((f) => (
                <button
                  key={f.phone}
                  type="button"
                  onClick={() => handleQuickLogin(f.phone)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl border border-surface-container bg-surface-container-low hover:bg-surface-variant hover:border-primary flex items-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span className="text-xl p-1.5 rounded-lg bg-surface-container-lowest">{f.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-on-surface truncate">
                      {f.name}
                    </div>
                    <div className="text-[11px] text-on-surface-variant truncate">
                      {f.role}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-base shrink-0">login</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};
