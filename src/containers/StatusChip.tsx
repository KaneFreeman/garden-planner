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
  size?: 'small' | 'large';
}

const StatusChip = ({ status, count, shrink, size = 'small' }: StatusChipProps) => {
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

  if (size === 'small') {
    return <StyledChip label={label} color={color} title={title} />;
  }

  return <Chip label={label} color={color} title={title} />;
};

export default StatusChip;
