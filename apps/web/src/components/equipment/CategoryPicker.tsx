import React from 'react';
import { useTranslation } from 'react-i18next';

interface Category {
  id: string;
  code: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  emoji?: string;
}

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryCode: string;
  onSelectCategory: (code: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryCode,
  onSelectCategory,
}) => {
  const { t, i18n } = useTranslation();

  const getCategoryName = (cat: Category) => {
    if (i18n.language === 'mr') return cat.nameMr;
    if (i18n.language === 'hi') return cat.nameHi;
    return cat.nameEn;
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-stone-700 tracking-wide uppercase">
          {t('equipment.categories')}
        </h3>
        {selectedCategoryCode && (
          <button
            onClick={() => onSelectCategory('')}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            {t('app.all')}
          </button>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => onSelectCategory('')}
          className={`snap-start shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-w-[76px] touch-target ${
            !selectedCategoryCode
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-black shadow-sm'
              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
          }`}
        >
          <span className="text-2xl mb-1">🌟</span>
          <span className="text-xs font-bold text-center leading-tight">
            {t('app.all')}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryCode === cat.code;
          return (
            <button
              key={cat.id || cat.code}
              onClick={() => onSelectCategory(cat.code)}
              className={`snap-start shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-w-[84px] touch-target ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-md scale-105'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl mb-1">{cat.emoji || '🚜'}</span>
              <span className="text-xs font-bold text-center leading-tight">
                {getCategoryName(cat)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
