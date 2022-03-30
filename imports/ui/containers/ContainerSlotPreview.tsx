import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, IconButton } from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import { Slot } from '../../api/Containers';

interface ContainerSlotProps {
  id: string;
  index: number;
  slot?: Slot;
}

const ContainerSlotPreview = ({ id, index, slot }: ContainerSlotProps) => {
  const navigate = useNavigate();

  const icon = useMemo(() => {
    if (!slot) {
      return <GrassIcon color="disabled" />;
    }

    if (!slot.pictures || slot.pictures.length === 0) {
      return <GrassIcon color="primary" />;
    }

    return <Avatar variant="square" src={slot.pictures[0]} alt={slot.plant} sx={{ width: 76, height: 76 }} />;
  }, [slot]);

  return (
    <IconButton sx={{ p: 2, width: 80, height: 80, border: '2px solid #2c2c2c', borderRadius: 0 }} onClick={() => navigate(`/container/${id}/slot/${index}`)}>
      {icon}
    </IconButton>
  );
};

export default ContainerSlotPreview;
