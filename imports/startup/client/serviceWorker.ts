// serviceWorker.js
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // eslint-disable-next-line compat/compat
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.info('service worker registered'))
    .catch((error) => {
      console.log('ServiceWorker registration failed: ', error);
    });
});
