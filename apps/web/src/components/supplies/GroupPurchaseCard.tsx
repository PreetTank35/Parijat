import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, Sparkles, Check } from 'lucide-react';
import { VoiceButton } from '../common/VoiceButton';

export interface GroupPurchaseItem {
  id: string;
  targetQuantity: number;
  currentQuantity: number;
  unit: string;
  discountPercent: number | null;
  status: string;
  targetDate: string;
  product: {
    id: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
    packSize: string;
    price: number;
    mrp: number | null;
    imageUrl: string | null;
    category: string;
  };
  village: {
    id: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
  };
  participants?: Array<{ id: string; quantity: number; userId: string }>;
}

interface GroupPurchaseCardProps {
  item: GroupPurchaseItem;
  onJoin: (id: string, quantity: number) => Promise<void>;
  isJoined?: boolean;
}

export const GroupPurchaseCard: React.FC<GroupPurchaseCardProps> = ({
  item,
  onJoin,
  isJoined = false,
}) => {
  const { t, i18n } = useTranslation();
  const [pledgeQuantity, setPledgeQuantity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getProductName = () => {
    if (i18n.language === 'mr') return item.product.nameMr;
    if (i18n.language === 'hi') return item.product.nameHi;
    return item.product.nameEn;
  };

  const getVillageName = () => {
    if (i18n.language === 'mr') return item.village.nameMr;
    if (i18n.language === 'hi') return item.village.nameHi;
    return item.village.nameEn;
  };

  const percentProgress = Math.min(
    100,
    Math.round((item.currentQuantity / item.targetQuantity) * 100)
  );

  const discountedPrice = item.discountPercent
    ? Math.round(item.product.price * (1 - item.discountPercent / 100))
    : item.product.price;

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pledgeQuantity <= 0) return;
    setIsSubmitting(true);
    try {
      await onJoin(item.id, pledgeQuantity);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const audioGuidance = `${getVillageName()} येथे ${getProductName()} साठी सामूहिक खरेदी सुरू आहे. ${item.discountPercent || 10}% सूट उपलब्ध आहे. आतापर्यंत ${item.currentQuantity} पैकी ${item.targetQuantity} ${item.unit} नोंदणी झाली आहे.`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
      {/* Top ribbon if discount */}
      {item.discountPercent && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black px-3 py-1 rounded-full self-start flex items-center gap-1 shadow-sm">
          <Sparkles size={12} />
          <span>{item.discountPercent}% बचत (Group Discount)</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {item.product.imageUrl && (
          <img
            src={item.product.imageUrl}
            alt={getProductName()}
            className="w-20 h-20 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-200"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              📍 {getVillageName()}
            </span>
            <VoiceButton text={audioGuidance} size="sm" />
          </div>
          <h4 className="font-extrabold text-base text-stone-900 mt-1 leading-snug line-clamp-2">
            {getProductName()}
          </h4>
          <p className="text-xs text-stone-500 font-medium mt-0.5">{item.product.packSize}</p>
        </div>
      </div>

      {/* Price comparison */}
      <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-stone-500 font-semibold block">
            {t('supplies.ourPrice')}
          </span>
          <span className="text-xl font-black text-emerald-700">₹{discountedPrice}</span>
        </div>
        {item.product.mrp && (
          <div className="text-right">
            <span className="text-[11px] text-stone-400 font-semibold block">
              {t('supplies.marketPrice')}
            </span>
            <span className="text-sm font-bold text-stone-400 line-through">
              ₹{item.product.mrp}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
          <span>
            {t('supplies.pledged')}: {item.currentQuantity} {item.unit}
          </span>
          <span className="text-emerald-700">
            {percentProgress}% ({item.targetQuantity} {item.unit})
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${percentProgress}%` }}
          />
        </div>
      </div>

      {/* Action button */}
      {isJoined ? (
        <div className="bg-emerald-100 text-emerald-900 font-bold text-sm py-3 px-4 rounded-2xl text-center flex items-center justify-center gap-2">
          <Check size={18} className="text-emerald-700" />
          <span>आपण या खरेदीत सहभागी आहात! (Joined)</span>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm py-3 px-4 rounded-2xl shadow-sm transition-all active:scale-95 touch-target flex items-center justify-center gap-2"
        >
          <Users size={18} />
          <span>{t('supplies.joinGroup')}</span>
        </button>
      )}

      {/* Join Pledge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-stone-900 mb-1">
              {t('supplies.joinGroup')}
            </h3>
            <p className="text-xs text-stone-500 mb-4">{getProductName()}</p>

            <form onSubmit={handlePledgeSubmit}>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                किती {item.unit} हवे आहेत? (Quantity)
              </label>
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPledgeQuantity(Math.max(1, pledgeQuantity - 1))}
                  className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 font-black text-xl text-stone-800"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={pledgeQuantity}
                  onChange={(e) => setPledgeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center font-black text-2xl py-2 border-2 border-emerald-500 rounded-2xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPledgeQuantity(pledgeQuantity + 1)}
                  className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 font-black text-xl text-stone-800"
                >
                  +
                </button>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl mb-6 text-xs text-emerald-900 font-semibold flex justify-between">
                <span>अंदाजे एकूण रक्कम:</span>
                <span className="font-bold text-sm">₹{pledgeQuantity * discountedPrice}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 text-sm"
                >
                  {t('app.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-sm"
                >
                  {isSubmitting ? t('app.loading') : t('app.confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
