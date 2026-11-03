import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';

export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout, updateLanguage } = useAuth();
  const { villages, selectedVillageId, setSelectedVillageId } = useLocation();
  const { speak } = useVoice();
  const navigate = useNavigate();

  // Anti-pattern fix: use useEffect instead of rendering-time navigate
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const languages = [
    { code: 'en', label: 'English (Primary)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleVoiceHelp = () => {
    speak('Your farmer profile. You can change your preferred language, update your home village, or sign out.');
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-8">
      <div className="max-w-md mx-auto px-margin py-space-md space-y-space-md">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold">
            Farmer Profile
          </h1>
          <button
            onClick={handleVoiceHelp}
            type="button"
            className="p-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-colors"
          >
            <span className="material-symbols-outlined text-xl text-tertiary">volume_up</span>
          </button>
        </div>

        {/* User Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-md p-space-md sm:p-space-lg">
          <div className="flex items-center gap-4 mb-space-md">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary font-headline-xl text-headline-xl font-bold flex items-center justify-center shadow-md">
              {user.name ? user.name[0] : 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-headline-md text-headline-md text-primary font-bold">
                <span className="truncate">{user.name || 'Verified Farmer'}</span>
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant font-mono mt-0.5">
                📞 +91 {user.phone}
              </p>
              <span className="inline-block mt-1 px-3 py-0.5 bg-secondary-container text-on-secondary-container font-label-md text-xs font-bold rounded-full">
                Verified Farmer Account
              </span>
            </div>
          </div>

          {/* Language Selection */}
          <div className="pt-space-md border-t border-surface-container">
            <label className="flex items-center gap-1.5 font-label-md text-label-md font-bold uppercase tracking-wider text-primary mb-2">
              <span className="material-symbols-outlined text-lg">language</span>
              <span>Preferred Language (भाषा)</span>
            </label>

            <div className="space-y-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => updateLanguage(l.code)}
                  className={`w-full p-3 rounded-xl border text-left font-label-lg flex items-center justify-between transition-all cursor-pointer ${
                    i18n.language === l.code
                      ? 'border-primary bg-primary-container text-on-primary font-bold shadow-sm'
                      : 'border-surface-container bg-surface-container-low text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  <span>{l.label}</span>
                  {i18n.language === l.code && (
                    <span className="material-symbols-outlined text-base">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Village Selection */}
          <div className="pt-space-md mt-space-md border-t border-surface-container">
            <label className="flex items-center gap-1.5 font-label-md text-label-md font-bold uppercase tracking-wider text-primary mb-2">
              <span className="material-symbols-outlined text-lg">location_on</span>
              <span>Home Village (गाव)</span>
            </label>
            <div className="relative">
              <select
                value={selectedVillageId}
                onChange={(e) => setSelectedVillageId(e.target.value)}
                className="w-full p-3 pr-10 rounded-xl border border-outline-variant font-label-lg text-on-surface bg-surface-container-low focus:bg-surface-container-lowest focus:border-primary outline-none appearance-none"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nameEn} ({v.taluka}, {v.district})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full py-3.5 rounded-full border border-error-container bg-error-container/40 hover:bg-error-container text-on-error-container font-label-lg font-bold flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </main>
  );
};
