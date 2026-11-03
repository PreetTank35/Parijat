import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import i18n from '../i18n';

interface VoiceContextType {
  isSpeaking: boolean;
  isListening: boolean;
  currentlySpeakingText: string | null;
  speak: (text: string, customLang?: string) => void;
  stop: () => void;
  startVoiceSearch: (onCommand?: (keyword: string) => void) => void;
  stopVoiceSearch: () => void;
  isSupported: boolean;
  transcript: string;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        setIsSupported(true);
        const updateVoices = () => {
          setVoices(window.speechSynthesis.getVoices());
        };
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      // Initialize speech recognition if available
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlySpeakingText(null);
    }
  }, []);

  // O(1) Instant Text-To-Speech with zero network overhead
  const speak = useCallback(
    (text: string, customLang?: string) => {
      if (!text) return;
      // Instantly cancel any ongoing utterance for 0ms delay
      stop();

      const lang = customLang || i18n.language || 'en';
      const targetLangTag = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLangTag;
        utterance.rate = 1.0; // Crisp natural speed
        utterance.pitch = 1.0;

        // Fast voice lookup
        const matchedVoice = voices.find(
          (v) => v.lang.toLowerCase() === targetLangTag.toLowerCase() || v.lang.startsWith(lang)
        );
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setCurrentlySpeakingText(text);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback visual display
        setIsSpeaking(true);
        setCurrentlySpeakingText(text);
        setTimeout(() => {
          setIsSpeaking(false);
          setCurrentlySpeakingText(null);
        }, 3500);
      }
    },
    [stop, voices]
  );

  // Instant AI Voice Search with Speech Recognition
  const startVoiceSearch = useCallback(
    (onCommand?: (keyword: string) => void) => {
      if (!recognitionRef.current) {
        speak('Voice search is listening. Please tap to search machinery or prices.');
        return;
      }

      try {
        const recognition = recognitionRef.current;
        const currentLang = i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.lang = currentLang;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('Listening... Speak now');
        };

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript.toLowerCase();
          setTranscript(spoken);
          setIsListening(false);

          // Fast O(1) keyword classification
          if (spoken.includes('tractor') || spoken.includes('ट्रॅक्टर') || spoken.includes('ट्रैक्टर')) {
            speak('Opening available tractors near your farm.');
            if (onCommand) onCommand('TRACTOR');
          } else if (spoken.includes('rotavator') || spoken.includes('रोटाव्हेटर') || spoken.includes('रोटावेटर')) {
            speak('Opening rotavators for seedbed tilling.');
            if (onCommand) onCommand('ROTAVATOR');
          } else if (spoken.includes('harvester') || spoken.includes('हार्वेस्टर') || spoken.includes('कापणी')) {
            speak('Opening combine grain harvesters.');
            if (onCommand) onCommand('HARVESTER');
          } else if (spoken.includes('mandi') || spoken.includes('rate') || spoken.includes('भाव') || spoken.includes('onion')) {
            speak('Opening live APMC mandi crop rates.');
            if (onCommand) onCommand('PRICES');
          } else if (spoken.includes('fertilizer') || spoken.includes('seed') || spoken.includes('खत') || spoken.includes('बियाणे')) {
            speak('Opening farm supplies and group buying.');
            if (onCommand) onCommand('SUPPLIES');
          } else {
            speak(`Searching for ${spoken}`);
            if (onCommand) onCommand(spoken);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setTranscript('');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      }
    },
    [speak]
  );

  const stopVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isSpeaking,
        isListening,
        currentlySpeakingText,
        speak,
        stop,
        startVoiceSearch,
        stopVoiceSearch,
        isSupported,
        transcript,
      }}
    >
      {children}

      {/* Floating Interactive Audio Guide Toast Overlay matching UI spec */}
      {(isSpeaking || isListening) && (
        <div className="fixed bottom-24 md:bottom-8 right-4 max-w-sm w-[calc(100%-2rem)] bg-inverse-surface text-inverse-on-surface p-4 rounded-2xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
            {isListening ? (
              <span className="material-symbols-outlined text-2xl text-on-secondary animate-pulse">mic</span>
            ) : (
              <span className="material-symbols-outlined text-2xl animate-spin">sync</span>
            )}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-label-lg text-label-lg font-bold leading-tight truncate text-primary-fixed">
              {isListening ? 'AI Voice Assistant Listening...' : 'Parijat Audio Guide Active...'}
            </p>
            <p className="font-label-md text-label-md text-inverse-on-surface/90 line-clamp-2 mt-0.5">
              {isListening ? transcript || 'Speak (e.g. "Tractor", "Rotavator", "Mandi rates")' : currentlySpeakingText}
            </p>
          </div>
          <button
            onClick={() => {
              stop();
              stopVoiceSearch();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-inverse-on-surface shrink-0"
            title="Stop audio"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      )}
    </VoiceContext.Provider>
  );
};

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
