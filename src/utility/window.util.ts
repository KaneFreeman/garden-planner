/* eslint-disable max-classes-per-file */
import { useEffect } from 'react';
import PWAUpdateConfirmEvent from './events/pawUpdateConfirmEvent';
import PWAUpdateAvailableEvent from './events/pwaUpdateAvailableEvent';

interface EventMap {
  pwaupdateavailable: PWAUpdateAvailableEvent;
  pwaupdateconfirm: PWAUpdateConfirmEvent;
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (event: WindowEventMap[K]) => void
): void;
export function useWindowEvent<K extends keyof EventMap>(eventName: K, callback: (event: EventMap[K]) => void): void;
export function useWindowEvent(eventName: string, callback: EventListenerOrEventListenerObject): void {
  useEffect(() => {
    window.addEventListener(eventName, callback);

    return () => {
      window.removeEventListener(eventName, callback);
    };
  });
}
