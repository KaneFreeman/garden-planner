import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import '../imports/api/Containers';
import '../imports/api/Plants';
import '../imports/api/Pictures';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;

  Accounts.emailTemplates.sendLoginToken.subject = function () {
    return 'Garden Planner Login Link';
  };

  Accounts.emailTemplates.sendLoginToken.html = function (user, _, { sequence }) {
    return `Login by clicking <a href="${Meteor.absoluteUrl()}login?username=${
      user.username
    }&token=${sequence}">here</a>`;
  };
});
