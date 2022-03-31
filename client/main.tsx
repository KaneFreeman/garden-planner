import React from 'react';
import { Meteor } from 'meteor/meteor';
import * as ReactDOMClient from 'react-dom/client';
import '../imports/startup/client/serviceWorker';
import App from '../imports/ui/App';

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = ReactDOMClient.createRoot(container as Element);
  document.getElementsByTagName('html')[0].lang = 'en';
  root.render(<App />);
});
