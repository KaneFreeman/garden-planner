import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ContainersCollection } from '../../api/Containers';
import ContainerSlotPreview from './ContainerSlotPreview';

const ContainerView = () => {
  const { id } = useParams();

  const container = useTracker(() => ContainersCollection.findOne(id), [id]);

  console.log('container', container);

  const slots = useMemo(() => {
    if (!id || !container) {
      return [];
    }

    return [...Array(container.rows * container.columns)].map((_, index) => (
      <ContainerSlotPreview slot={container.slots?.[index]} id={id} index={index} />
    ));
  }, [container, id]);

  if (!container) {
    return (
      <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {container.name}
        <Typography variant="subtitle1" component="span" sx={{ ml: 1 }} color="GrayText">
          {container?.rows} x {container?.columns}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${container.rows}, minmax(0, 1fr))`,
              width: (container?.rows ?? 1) * 80,
              height: (container?.columns ?? 1) * 80,
              border: '2px solid #2c2c2c'
            }}
          >
            {slots}
          </Box>
        </Box>
      </Typography>
    </Box>
  );
};

export default ContainerView;
