import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import { VoiceButton } from '../common/VoiceButton';

export interface EquipmentListingItem {
  id: string;
  titleEn: string;
  titleMr: string | null;
  titleHi: string | null;
  description: string | null;
  rentalRate: number;
  rentalUnit: string;
  securityDeposit: number | null;
  status: string;
  distanceKm?: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  village?: {
    id: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
    taluka: string;
  };
  owner?: {
    id: string;
    name: string | null;
    isVerified: boolean;
  };
  category?: {
    code: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
    emoji?: string;
  };
}

interface MachineCardProps {
  listing: EquipmentListingItem;
}

export const MachineCard: React.FC<MachineCardProps> = ({ listing }) => {
  const { t, i18n } = useTranslation();

  const getTitle = () => {
    if (i18n.language === 'mr' && listing.titleMr) return listing.titleMr;
    if (i18n.language === 'hi' && listing.titleHi) return listing.titleHi;
    return listing.titleEn;
  };

  const getVillageName = () => {
    if (!listing.village) return '';
    if (i18n.language === 'mr') return listing.village.nameMr;
    if (i18n.language === 'hi') return listing.village.nameHi;
    return listing.village.nameEn;
  };

  const imageUrl =
    listing.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&auto=format&fit=crop&q=80';

  const unitLabel =
    listing.rentalUnit === 'HOURLY' ? t('equipment.perHour') : t('equipment.perDay');

  // Spoken text for audio assist
  const spokenText = `${getTitle()}. ${t('equipment.village')}: ${getVillageName()}. ${t('equipment.rentalCharges')}: ${listing.rentalRate} रुपये ${unitLabel}.`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Rate overlay badge */}
        <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl shadow-lg flex items-baseline gap-1">
          <span className="text-lg font-black text-amber-400">₹{listing.rentalRate}</span>
          <span className="text-xs text-stone-300 font-semibold">{unitLabel}</span>
        </div>

        {/* Audio guidance button */}
        <div className="absolute top-3 right-3">
          <VoiceButton text={spokenText} size="sm" />
        </div>

        {/* Distance badge if available */}
        {listing.distanceKm !== undefined && (
          <div className="absolute bottom-3 left-3 bg-emerald-900/85 backdrop-blur-md text-emerald-100 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow">
            <MapPin size={12} />
            <span>{listing.distanceKm} किमी अंतरावर</span>
          </div>
        )}
      </div>

      {/* Details body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-1">
            <MapPin size={13} className="text-stone-400" />
            <span>
              {getVillageName()}
              {listing.village?.taluka ? ` (${listing.village.taluka})` : ''}
            </span>
          </div>

          <h3 className="font-extrabold text-base text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {getTitle()}
          </h3>

          {/* Owner info */}
          <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-600">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
              {listing.owner?.name ? listing.owner.name[0] : 'श'}
            </div>
            <span className="font-medium truncate">{listing.owner?.name || t('equipment.owner')}</span>
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
          <Link
            to={`/equipment/${listing.id}`}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-extrabold text-sm py-3 px-4 rounded-2xl shadow-sm text-center flex items-center justify-center gap-1.5 transition-all touch-target"
          >
            <span>{t('equipment.bookNow')}</span>
            <span>👉</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
