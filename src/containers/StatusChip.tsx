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
  shrink?: boolean;
}

const StatusChip = ({ status, count, shrink }: StatusChipProps) => {
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

  const label = useMemo(() => {
    if (count !== undefined) {
      if (shrink) {
        return count ? `${count}` : status;
      }
      return `${count ? `${count} ` : ''}${status}`;
    }

    return status;
  }, [count, shrink, status]);

  const title = useMemo(() => `${count ? `${count} ` : ''}${status}`, [count, status]);

  return <StyledChip label={label} color={color} title={title} />;
};

export default StatusChip;
