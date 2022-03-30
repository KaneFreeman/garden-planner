import React from 'react';
import { Meteor } from 'meteor/meteor';
import * as ReactDOMClient from 'react-dom/client';
import App from '../imports/ui/App';

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = ReactDOMClient.createRoot(container as Element);
  root.render(<App />);
});
