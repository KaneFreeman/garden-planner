import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Main } from './Main';

export const App = () => {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </ThemeProvider>
  );
};
