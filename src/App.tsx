import { useCallback, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useWindowEvent } from './utility/window.util';
import PWAUpdateConfirmEvent from './utility/events/pawUpdateConfirmEvent';
import Main from './Main';
import { store } from './store';
import './App.css';
import { useCheckForUpdates } from './utility/pwa.util';

const App = () => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark'
        }
      }),
    []
  );

  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [updating, setUpdating] = useState(false);

  const onUpdate = useCallback(() => {
    setHasNewVersion(true);
  }, []);

  const onUpdateMessageAccept = useCallback(() => {
    setUpdating(true);
    window.dispatchEvent(new PWAUpdateConfirmEvent());
  }, []);

  useWindowEvent('pwaupdateavailable', onUpdate);
  useCheckForUpdates();

  const updateAlert = useMemo(
    () => (
      <Alert severity="info" classes={{ root: 'alert-root', message: 'alert-message' }}>
        <Box>{updating ? 'Updating...' : 'A new version is available'}</Box>
        {!updating ? (
          <Button color="secondary" size="small" onClick={onUpdateMessageAccept}>
            Update
          </Button>
        ) : null}
      </Alert>
    ),
    [onUpdateMessageAccept, updating]
  );

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN ?? ''}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''}
      redirectUri={window.location.origin}
    >
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <BrowserRouter>
              <Main />
            </BrowserRouter>
            <Snackbar open={hasNewVersion}>{updateAlert}</Snackbar>
          </LocalizationProvider>
        </Provider>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
