import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const offlineStatus = document.getElementById('offline-status');

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  if (offlineStatus) {
    offlineStatus.hidden = false;
    offlineStatus.textContent = 'Preparing offline mode...';
  }

  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register(new URL('sw.js', document.baseURI).href);
      await navigator.serviceWorker.ready;
      if (offlineStatus) {
        offlineStatus.textContent = 'Offline ready';
        offlineStatus.dataset.state = 'ready';
      }
    } catch (error) {
      console.error('Offline cache setup failed:', error);
      if (offlineStatus) {
        offlineStatus.textContent = 'Online mode';
        offlineStatus.dataset.state = 'error';
      }
    }
  });
}
