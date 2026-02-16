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
import { store } from './store';
import PWAUpdateConfirmEvent from './utility/events/pawUpdateConfirmEvent';
import { useCheckForUpdates } from './utility/pwa.util';
import { useWindowEvent } from './utility/window.util';

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
          <BrowserRouter>
            <Main />
          </BrowserRouter>
          <Snackbar open={hasNewVersion}>{updateAlert}</Snackbar>
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
