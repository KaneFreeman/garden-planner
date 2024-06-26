import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import PWAUpdateAvailableEvent from './utility/events/pwaUpdateAvailableEvent';

const container = document.getElementById('root') as Element;
const root = createRoot(container);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      window.dispatchEvent(new PWAUpdateAvailableEvent());

      window.addEventListener('pwaupdateconfirm', () => {
        waitingServiceWorker.addEventListener('statechange', (event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (event.target && (event.target as any).state === 'activated') {
            window.location.reload();
          }
        });
      });

      window.serviceWorkerWaiting = waitingServiceWorker;
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
