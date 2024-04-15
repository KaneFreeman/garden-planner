import Link from '@mui/material/Link';
import Typography, { TypographyProps } from '@mui/material/Typography';

export type CopyrightProps = TypographyProps;

const Copyright = (props: CopyrightProps) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={import.meta.env.VITE_PUBLIC_URL}>
        Garden Planner
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
