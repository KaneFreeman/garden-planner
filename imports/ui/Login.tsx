import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Box } from '@mui/material';
import { Accounts } from 'meteor/accounts-base';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get('username');
  const token = searchParams.get('token');

  useEffect(() => {
    if (username !== null && token !== null) {
      Meteor.passwordlessLoginWithToken(username, token, () => {
        navigate('/');
      });
    } else if (Meteor.userId() === null) {
      Accounts.requestLoginTokenForUser({
        selector: Meteor.settings.public.masterAccount,
        userData: {
          username: Meteor.settings.public.masterAccount,
          email: Meteor.settings.public.masterAccount,
          profile: {
            name: Meteor.settings.public.masterName
          }
        }
      });
    }
  }, [username, token, navigate]);

  return (
    <Box
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        display: 'flex'
      }}
    >
      {username !== null && token !== null
        ? 'Checking login...'
        : 'You are not logged in! You must login. An email has been sent with a login link.'}
    </Box>
  );
};

export default Login;
