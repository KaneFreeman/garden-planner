import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Main from './Main';
import { RealtimeController } from './realtime/useRealtimeSync';
import { useAppSelector } from './store/hooks';
import { store } from './store';
import { selectIsOnline, selectIsReadOnly, selectRealtimeLastError } from './store/slices/global';
import { selectUser } from './store/slices/auth';
import PWAUpdateConfirmEvent from './utility/events/pawUpdateConfirmEvent';
import { useCheckForUpdates } from './utility/pwa.util';
import { useWindowEvent } from './utility/window.util';

const RealtimeStatusSnackbar = () => {
  const user = useAppSelector(selectUser);
  const isOnline = useAppSelector(selectIsOnline);
  const isReadOnly = useAppSelector(selectIsReadOnly);
  const realtimeLastError = useAppSelector(selectRealtimeLastError);

  const statusAlert = useMemo(() => {
    if (!user || !isReadOnly) {
      return null;
    }

    const message = !isOnline
      ? 'Offline. The app is read-only until your connection returns.'
      : 'Realtime sync is reconnecting. Changes are disabled until it returns.';

    return (
      <Alert severity="warning" classes={{ root: 'alert-root', message: 'alert-message' }}>
        <Box>{realtimeLastError ? `${message} ${realtimeLastError}` : message}</Box>
      </Alert>
    );
  }, [isOnline, isReadOnly, realtimeLastError, user]);

  if (!statusAlert) {
    return null;
  }

  return (
    <Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} open>
      {statusAlert}
    </Snackbar>
  );
};

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
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RealtimeController />
          <BrowserRouter>
            <Main />
          </BrowserRouter>
          <RealtimeStatusSnackbar />
          <Snackbar open={hasNewVersion}>{updateAlert}</Snackbar>
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
