import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Meteor } from 'meteor/meteor';
import useScreenOrientation from '../hooks/useOrientation';
import Login from './Login';
import Header from './Header';
import Actions from './Actions';
import Plants from './plants/Plants';
import PlantView from './plants/PlantView';
import Containers from './containers/Containers';
import ContainerView from './containers/ContainerView';
import ContainerSlotView from './containers/ContainerSlotView';

const Main = () => {
  const navigate = useNavigate();
  const orientation = useScreenOrientation();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (Meteor.userId() === null) {
      navigate({ pathname: 'login', search });
    } else if (pathname === '/login') {
      navigate('/');
    }
  }, [navigate, pathname, search]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header />
      <Actions />
      <Box sx={{ display: 'flex', width: '100%', boxSizing: 'border-box', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            maxWidth: orientation.startsWith('landscape') ? 'unset' : 800,
            justifyContent: 'center'
          }}
        >
          <Routes>
            <Route path="/" element={<Containers />} />
            <Route path="/container/:id" element={<ContainerView />} />
            <Route path="/container/:id/slot/:index" element={<ContainerSlotView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<PlantView />} />
          </Routes>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Main;
