/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';
import { useWindowEvent } from './window.util';

const UPDATE_CHECK_DELAY = 60000;

const useInstallUpdate = () => {
  const callback = useCallback(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, []);

  useWindowEvent('pwaupdateconfirm', callback);
};

export const useCheckForUpdates = () => {
  useInstallUpdate();

  useEffect(() => {
    async function tick() {
      const registration = await navigator.serviceWorker.getRegistration();
      registration?.update();
    }

    const id = setInterval(tick, UPDATE_CHECK_DELAY);

    return () => clearInterval(id);
  }, []);
};
