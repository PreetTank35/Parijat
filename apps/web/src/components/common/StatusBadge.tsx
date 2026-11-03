import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (status) {
      case 'REQUESTED':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: <Clock size={size === 'sm' ? 14 : 16} className="text-amber-600" />,
          label: t('booking.status.REQUESTED'),
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 size={size === 'sm' ? 14 : 16} className="text-emerald-600" />,
          label: t('booking.status.ACCEPTED'),
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-50 text-red-800 border-red-300',
          icon: <XCircle size={size === 'sm' ? 14 : 16} className="text-red-600" />,
          label: t('booking.status.REJECTED'),
        };
      case 'CANCELLED':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-300',
          icon: <AlertCircle size={size === 'sm' ? 14 : 16} className="text-stone-500" />,
          label: t('booking.status.CANCELLED'),
        };
      case 'COMPLETED':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: <CheckCheck size={size === 'sm' ? 14 : 16} className="text-blue-600" />,
          label: t('booking.status.COMPLETED'),
        };
      default:
        return {
          bg: 'bg-stone-50 text-stone-800 border-stone-200',
          icon: null,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-3 py-1 text-sm gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${config.bg} ${sizeClass}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
