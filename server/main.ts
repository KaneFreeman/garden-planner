import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import '../imports/api/Containers';
import { PlantsCollection } from '../imports/api/Plants';
import { PicturesCollection } from '../imports/api/Pictures';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;

  PlantsCollection.find()
    .fetch()
    .forEach((plant) => {
      const pictures = plant.pictures?.map((picture) => {
        if (picture.pictureId !== undefined) {
          return picture;
        }

        const newPicture = { ...picture };
        const { dataUrl } = newPicture;
        delete newPicture.dataUrl;

        let pictureId: string | undefined;
        if (dataUrl) {
          pictureId = PicturesCollection.insert({ dataUrl });
        }

        return {
          ...newPicture,
          pictureId
        };
      });

      PlantsCollection.update(plant._id, { $set: { pictures } });
    });

  Accounts.emailTemplates.sendLoginToken.subject = function () {
    return 'Garden Planner Login Link';
  };

  Accounts.emailTemplates.sendLoginToken.html = function (user, _, { sequence }) {
    return `Login by clicking <a href="${Meteor.absoluteUrl()}login?username=${
      user.username
    }&token=${sequence}">here</a>`;
  };
});
