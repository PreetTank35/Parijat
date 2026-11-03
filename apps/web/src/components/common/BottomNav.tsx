import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/equipment', label: 'Machines', icon: 'agriculture' },
    { to: '/list-equipment', label: 'List', icon: 'add_circle' },
    { to: '/prices', label: 'Mandi', icon: 'trending_up' },
    { to: '/bookings', label: 'Bookings', icon: 'event_note' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(38,51,43,0.08)] border-t border-surface-container">
      <nav className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 min-h-[48px] w-14 transition-colors ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="font-label-md text-label-md text-[11px] leading-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
