/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

const StyledChip = styled(Chip)({
  height: 24,
  fontSize: 12
});

export interface DisplayStatusChipProps {
  status: 'Not Planted' | 'Planted' | 'Transplanted' | 'Closed';
  count?: number;
  shrink?: boolean;
  size?: 'small' | 'large';
}

const DisplayStatusChip = ({ status, count, shrink, size = 'small' }: DisplayStatusChipProps) => {
  const color: 'default' | 'success' | 'error' | 'warning' = useMemo(() => {
    switch (status) {
      case 'Planted':
        return 'success';
      case 'Transplanted':
        return 'error';
      case 'Closed':
        return 'warning';
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

export default DisplayStatusChip;
