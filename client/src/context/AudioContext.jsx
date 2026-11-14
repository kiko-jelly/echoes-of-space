import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const synthRef = useRef(null);
  const utterRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);
    }
  }, []);

  const speak = (text) => {
    if (!synthRef.current || !text) return;

    // Stop any existing speech first
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterRef.current = utterance;
    setCurrentText(text);

    // Pick a warm, friendly voice if available
    const voices = synthRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google'))) || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.rate = 0.95; // slightly slower, clear for kids & storytelling
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
  };

  const pause = () => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    }
  };

  return (
    <AudioContext.Provider value={{
      speak,
      pause,
      resume,
      stop,
      isSpeaking,
      isPaused,
      currentText,
      isSupported
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
