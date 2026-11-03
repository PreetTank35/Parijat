import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useTranslation } from 'react-i18next';

interface VoiceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  text,
  size = 'md',
  className = '',
  label,
}) => {
  const { isSpeaking, currentlySpeakingText, speak, stop } = useVoice();
  const { t } = useTranslation();

  const isCurrentActive = isSpeaking && currentlySpeakingText === text;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentActive) {
      stop();
    } else {
      speak(text);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1',
    md: 'p-2.5 text-sm gap-1.5 min-h-[44px]',
    lg: 'px-4 py-3 text-base gap-2 min-h-[52px]',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isCurrentActive ? t('app.stop') : t('app.listen')}
      title={isCurrentActive ? t('app.stop') : t('app.listen')}
      className={`inline-flex items-center justify-center rounded-full font-bold transition-all shadow-sm active:scale-95 ${
        isCurrentActive
          ? 'bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
      } ${sizeClasses[size]} ${className}`}
    >
      {isCurrentActive ? (
        <VolumeX size={iconSizes[size]} className="animate-spin" />
      ) : (
        <Volume2 size={iconSizes[size]} className="text-emerald-700" />
      )}
      {label && <span>{isCurrentActive ? t('app.stop') : label}</span>}
      {!label && (
        <span className="sr-only sm:not-sr-only text-xs font-semibold">
          {isCurrentActive ? t('app.stop') : t('app.listen')}
        </span>
      )}
    </button>
  );
};
