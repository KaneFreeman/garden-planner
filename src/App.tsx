import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { Auth0Provider } from '@auth0/auth0-react';
import Main from './Main';
import { store } from './store';
import './App.css';

const App = () => {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark'
        }
      }),
    []
  );

  return (
    <Auth0Provider
      domain="https://dev-p70ch9rb.us.auth0.com"
      clientId="zjr0Ek3kc2rzXewGTPCpVcYqb1Yex8QQ"
      redirectUri={window.location.origin}
    >
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <Main />
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
