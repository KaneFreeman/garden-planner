interface UserEmail {
  address: string;
  verified: boolean;
}

interface User {
  _id: string;
  username?: string | undefined;
  emails?: UserEmail[] | undefined;
  createdAt?: Date | undefined;
  profile?: any;
  services?: any;
}

declare module 'meteor/accounts-base' {
  module Accounts {
    function requestLoginTokenForUser(
      options: {
        selector: string;
        userData: {
          username: string;
          email: string;
          profile: {
            name: string;
          };
        };
      },
      callback?: () => void
    ): void;

    interface EmailTemplates {
      sendLoginToken: {
        subject?: ((user: User) => string) | undefined;
        html?: (user: User, url: string, extra: { sequence: string }) => void;
      };
    }
  }
}

declare module 'meteor/meteor' {
  module Meteor {
    function passwordlessLoginWithToken(
      selector: string,
      token: string,
      callback?: () => void
    ): void;
  }
}
