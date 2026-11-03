import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useVoice } from '../../context/VoiceContext';

export const TopNav: React.FC = () => {
  const { i18n } = useTranslation();
  const { user, isAuthenticated, updateLanguage } = useAuth();
  const { villages, selectedVillageId, setSelectedVillageId, selectedVillage } = useLocation();
  const { speak, isSpeaking, stop } = useVoice();
  const [showVillageModal, setShowVillageModal] = useState(false);

  const handleLanguageChange = (code: string) => {
    updateLanguage(code);
  };

  const getVillageDisplayName = () => {
    if (!selectedVillage) return 'Baramati, Pune';
    if (i18n.language === 'mr') return `${selectedVillage.nameMr}, ${selectedVillage.district}`;
    if (i18n.language === 'hi') return `${selectedVillage.nameHi}, ${selectedVillage.district}`;
    return `${selectedVillage.nameEn}, ${selectedVillage.district}`;
  };

  const farmerName = user?.name || 'Dnyaneshwar Patil';

  const handleGlobalAudioClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      const prompt =
        i18n.language === 'mr'
          ? 'पारिजात शेतकरी मार्केटप्लेस मध्ये आपले स्वागत आहे. अवजारे भाड्याने घ्या किंवा आजचे मंडी भाव तपासा.'
          : 'Welcome to Parijat Farmer Marketplace. Find equipment, live mandi crop rates, and farming supplies near your village.';
      speak(prompt);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/equipment', label: 'Rent Equipment' },
    { to: '/list-equipment', label: 'List Equipment' },
    { to: '/prices', label: 'Mandi Rates' },
    { to: '/bookings', label: 'My Bookings' },
    { to: '/supplies', label: 'Supplies' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_2px_8px_rgba(38,51,43,0.06)]">
        <div className="h-20 max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-sm">
          {/* Logo & Brand + Location */}
          <div className="flex items-center gap-space-sm shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                alt="Parijat Brand Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XxKc_CEFncKR_3QPcuxTLx2wMkfl-8hBTFJUu-rzcww6x--3UI_8hp5OWmJo5zifYCFQAVtp7Yb67o8squ6da7RjIVeK9PKY9rKM4NGKYmkvi8kuN7jJVbA_ZimPsULUet26Jn1FVTNIS0fA7LTS65RlR1gNdBMDXHpLS_c-8aKxz-vP5xFq7hQStXRw1tJJwcS-R03h9hV7Sr6f7GO0IxL19h2wAnllLZVKPEK4RPH5yieODj5OnwQ5tg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-headline-md text-headline-md text-primary tracking-tight leading-none">
                  Parijat
                </span>
                <span className="font-label-md text-label-md text-secondary leading-tight">
                  Farmer Marketplace
                </span>
              </div>
            </Link>

            {/* Location Pill */}
            <button
              onClick={() => setShowVillageModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container rounded-full text-on-surface hover:bg-surface-variant transition-colors min-h-[44px]"
              type="button"
            >
              <span className="material-symbols-outlined text-primary text-xl">location_on</span>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md leading-none font-bold">
                  {getVillageDisplayName()}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant hidden lg:inline leading-none">
                  Change
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-lg">expand_more</span>
            </button>
          </div>

          {/* Vernacular Language Switcher Pill */}
          <div className="hidden lg:flex items-center bg-surface-container-low p-1 rounded-full">
            <button
              onClick={() => handleLanguageChange('mr')}
              className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors min-h-[38px] ${
                i18n.language === 'mr'
                  ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              मराठी
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors min-h-[38px] ${
                i18n.language === 'hi'
                  ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              हिन्दी
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors min-h-[38px] ${
                i18n.language === 'en'
                  ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              English
            </button>
          </div>

          {/* Right Action: Audio Guide & Farmer Profile */}
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={handleGlobalAudioClick}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all shadow-sm min-h-[48px] ${
                isSpeaking
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-xl text-tertiary">
                {isSpeaking ? 'pause_circle' : 'volume_up'}
              </span>
              <span className="font-label-lg text-label-lg hidden sm:inline text-on-tertiary-fixed">
                {isSpeaking ? 'Stop Audio' : 'Audio Guide'}
              </span>
            </button>

            {/* Profile Avatar & Name */}
            <Link to={isAuthenticated ? '/profile' : '/auth'} className="flex items-center gap-2 pl-1">
              <div className="hidden xl:flex flex-col text-right">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight">
                  {farmerName}
                </span>
                <span className="font-label-md text-label-md text-secondary leading-none">
                  Verified Farmer
                </span>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPKWdGz2c_Eao2YL1ASfvi50r3yiDAT3j0-wvScpooJUoO1gfQNrd3_kASFeBTPnCAHAD01VdiwuFzSoGtHsiMJ4kj_kVXYmRqyN_uaO4Emg63d7iRwAKEhCHN0y3Hn0xbeBbAPihUrZzDvkcvDkpSUhND5f-2-SXWzwJ6QPW3wjAvPFChgTwmFdFTE03HkTXkRNWnlI75p7fudi_glD1gLxwoh0cSxK-iG-9yUIXaJMeN5Kf-OmLYJQ"
              />
            </Link>
          </div>
        </div>

        {/* Subnav for Desktop / Tablet */}
        <div className="hidden md:block bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
            <nav className="flex items-center gap-1 py-1.5 overflow-x-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 transition-colors whitespace-nowrap font-label-lg text-label-lg rounded-lg ${
                      isActive
                        ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Village Change Modal */}
      {showVillageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-surface-container">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-md text-primary font-bold">
                Select Your Village
              </h3>
              <button
                onClick={() => setShowVillageModal(false)}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">
              Machinery and mandi rates will adapt to your selected village center.
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {villages.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVillageId(v.id);
                    setShowVillageModal(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                    selectedVillageId === v.id
                      ? 'border-primary bg-primary-container text-on-primary'
                      : 'border-surface-container bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span>
                    {v.nameEn} ({v.taluka})
                  </span>
                  {selectedVillageId === v.id && (
                    <span className="material-symbols-outlined text-base">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

