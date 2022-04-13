/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Status } from '../interface';

const StyledChip = styled(Chip)({
  height: 24,
  fontSize: 12
});

interface StatusChipProps {
  status: Status;
  count?: number;
}

const StatusChip = ({ status, count }: StatusChipProps) => {
  const color: 'default' | 'success' | 'error' = useMemo(() => {
    switch (status) {
      case 'Planted':
        return 'success';
      case 'Transplanted':
        return 'error';
      default:
        return 'default';
    }
  }, [status]);

  const label = useMemo(() => `${count ? `${count} ` : ''}${status}`, [count, status]);

  return <StyledChip label={label} color={color} />;
};

export default StatusChip;
