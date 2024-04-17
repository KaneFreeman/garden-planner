import Box from '@mui/material/Box';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../header/Header';
import ScrollToTop from '../components/ScrollToTop';
import ContainerSelectViewRoute from '../containers/ContainerSelectViewRoute';
import ContainerSlotRoute from '../containers/ContainerSlotRoute';
import ContainerSubSlotRoute from '../containers/ContainerSubSlotRoute';
import ContainerViewRoute from '../containers/ContainerViewRoute';
import Containers from '../containers/Containers';
import PlantView from '../plants/PlantView';
import Plants from '../plants/Plants';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPlantInstancesByIds } from '../store/slices/plant-instances';
import { buildTaskLookupByContainer, selectTasks } from '../store/slices/tasks';
import TaskViewRoute from '../tasks/TaskViewRoute';
import Tasks from '../tasks/Tasks';
import { selectSelectedGarden } from '../store/slices/gardens';

const GardenView = () => {
  const dispatch = useAppDispatch();
  const plantInstancesByIds = useAppSelector(selectPlantInstancesByIds);
  const tasks = useAppSelector(selectTasks);
  const garden = useAppSelector(selectSelectedGarden);

  useEffect(() => {
    dispatch(buildTaskLookupByContainer({ tasks, plantInstancesByIds }));
  }, [dispatch, plantInstancesByIds, tasks]);

  return (
    <React.Fragment key={garden?._id}>
      <Header />
      <ScrollToTop />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'center',
          height: 'calc(100dvh - 56px)',
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
            <Route path="/container/:id" element={<ContainerViewRoute />} />
            <Route path="/container/:id/slot/:index" element={<ContainerSlotRoute />} />
            <Route path="/container/:id/slot/:index/sub-slot" element={<ContainerSubSlotRoute />} />
            <Route
              path="/container/:id/slot/:index/transplant/:otherContainerId"
              element={<ContainerSelectViewRoute />}
            />
            <Route path="/plants" element={<Plants />} />
            <Route path="/plant/:id" element={<PlantView />} />
            <Route path="/task/:id" element={<TaskViewRoute />} />
          </Routes>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default GardenView;
