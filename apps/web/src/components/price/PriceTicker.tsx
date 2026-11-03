import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PriceItem {
  id: string;
  crop: {
    code: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
    emoji: string;
  };
  market: {
    nameEn: string;
    nameMr: string;
    nameHi: string;
  };
  modalPrice: number;
  unit: string;
}

interface PriceTickerProps {
  prices: PriceItem[];
}

export const PriceTicker: React.FC<PriceTickerProps> = ({ prices }) => {
  const { t, i18n } = useTranslation();

  if (!prices || prices.length === 0) return null;

  const getCropName = (crop: PriceItem['crop']) => {
    if (i18n.language === 'mr') return crop.nameMr;
    if (i18n.language === 'hi') return crop.nameHi;
    return crop.nameEn;
  };

  const getMarketName = (market: PriceItem['market']) => {
    if (i18n.language === 'mr') return market.nameMr;
    if (i18n.language === 'hi') return market.nameHi;
    return market.nameEn;
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-4 shadow-md overflow-hidden relative">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
            <TrendingUp size={18} className="text-white" />
          </span>
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-amber-50">
            {t('prices.title')}
          </h4>
        </div>
        <Link
          to="/prices"
          className="text-xs font-bold bg-white text-amber-800 hover:bg-amber-50 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1"
        >
          <span>{t('home.viewAll')}</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Horizontal scrolling ticker items */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x">
        {prices.slice(0, 8).map((p) => (
          <Link
            key={p.id}
            to={`/prices?crop=${p.crop.code}`}
            className="snap-start shrink-0 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl p-3 border border-white/20 min-w-[140px] transition-all"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg">{p.crop.emoji}</span>
              <span className="font-black text-sm text-white truncate">
                {getCropName(p.crop)}
              </span>
            </div>
            <div className="text-[11px] text-amber-100 font-medium truncate mb-1">
              {getMarketName(p.market)}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">₹{p.modalPrice}</span>
              <span className="text-[10px] text-amber-200 font-semibold">
                {t('prices.perQuintal')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
