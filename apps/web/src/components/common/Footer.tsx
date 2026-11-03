import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface mt-space-xl shadow-[0_-2px_12px_rgba(38,51,43,0.04)] pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg">
        {/* Toll-Free Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm mb-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Toll-Free Farmer Helpline
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Crop advisory, equipment assistance &amp; technical guidance 24x7
              </p>
            </div>
          </div>
          <a
            className="flex items-center justify-center gap-2 w-full md:w-auto px-space-lg py-3 rounded-full bg-primary-container text-on-primary font-label-xl text-label-xl shadow-sm hover:opacity-95 transition-all min-h-[56px]"
            href="tel:18002335500"
          >
            <span className="material-symbols-outlined">phone_in_talk</span>
            <span>1800-233-5500 (Toll Free)</span>
          </a>
        </div>

        {/* Legal & Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-on-surface-variant gap-space-sm pt-space-sm font-label-md text-label-md">
          <p>© 2024 Parijat Kisan Agritech. All rights reserved.</p>
          <div className="flex items-center gap-space-md">
            <span className="text-secondary font-semibold">
              Rural Development &amp; Farmer Empowerment Initiative
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
