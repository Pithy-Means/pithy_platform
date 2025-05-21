"use client";

import { useState, useEffect } from 'react';

export default function PWAInstallPromotion() {
  type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  };

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Store the install prompt event for later use
    // TypeScript may not have BeforeInstallPromptEvent in the DOM lib, so we declare it if needed
    type BeforeInstallPromptEvent = Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setInstallPrompt(event);
      setIsVisible(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
      setIsVisible(false);
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center z-50">
      <div>
        <h3 className="font-bold">Install Pithy Means</h3>
        <p className="text-sm">Add to your home screen for a better experience</p>
      </div>
      <button 
        onClick={handleInstallClick}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Install
      </button>
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-2 text-gray-500"
      >
        ✕
      </button>
    </div>
  );
}