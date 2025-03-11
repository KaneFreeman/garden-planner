import { SxProps, Theme } from '@mui/material/styles';
import { useMemo } from 'react';
import Chip from '../components/Chip';

export interface DisplayStatusChipProps {
  status: 'Not Planted' | 'Planted' | 'Transplanted' | 'Closed' | 'Planning';
  count?: number;
  shrink?: boolean;
  size?: 'small' | 'large';
  sx?: SxProps<Theme> | undefined;
}

const DisplayStatusChip = ({ status, count, shrink, size = 'small', sx }: DisplayStatusChipProps) => {
  const color: 'default' | 'success' | 'error' | 'warning' | 'primary' = useMemo(() => {
    switch (status) {
      case 'Planning':
        return 'primary';
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

  return (
    <Chip color={color} title={title} size={size} sx={sx}>
      {label}
    </Chip>
  );
};

export default DisplayStatusChip;
