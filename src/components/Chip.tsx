import { useMemo } from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';

const StyledChip = styled(MuiChip)({
  height: 24,
  fontSize: 12
});

export interface ChipProps {
  children: MuiChipProps['label'];
  title: MuiChipProps['title'];
  color?: MuiChipProps['color'];
  colors?: {
    backgroundColor: string;
    color: string;
  };
  size?: 'small' | 'large';
  sx?: MuiChipProps['sx'];
}

const Chip = ({ children: label, title, color, colors, size = 'small', sx }: ChipProps) => {
  const finalSx: SxProps<Theme> = useMemo(
    () => ({
      ...(sx ?? {}),
      fontWeight: 600,
      ...(colors ? colors : {})
    }),
    [colors, sx]
  );

  if (size === 'small') {
    return <StyledChip sx={finalSx} label={label} color={color} title={title} />;
  }

  return <MuiChip sx={finalSx} label={label} color={color} title={title} />;
};

export default Chip;
