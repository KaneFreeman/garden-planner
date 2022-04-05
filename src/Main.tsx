import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './Header';
import Plants from './plants/Plants';
import PlantView from './plants/PlantView';
import Containers from './containers/Containers';
import ContainerView from './containers/ContainerView';
import ContainerSlotView from './containers/ContainerSlotView';
import Tasks from './tasks/Tasks';

const Main = () => {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    return <button type="button" onClick={loginWithRedirect}>Log in</button>;
  }

  console.log(user?.email, process.env.REACT_APP_MASTER_EMAIL);
  if (user?.email !== process.env.REACT_APP_MASTER_EMAIL) {
    return <div>Not authorized</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'center',
          height: 'calc(100vh - 56px)',
          top: '56px',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            justifyContent: 'center'
          }}
        >
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/containers" element={<Containers />} />
            <Route path="/container/:id" element={<ContainerView />} />
            <Route path="/container/:id/slot/:index" element={<ContainerSlotView />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<PlantView />} />
          </Routes>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Main;
