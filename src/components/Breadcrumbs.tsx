import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterNullish } from '../utility/null.util';
import useSmallScreen from '../utility/smallScreen.util';
import './Breadcrumbs.css';

interface TrailEntry {
  to: string;
  label: ReactNode;
}

interface BreadcrumbsProperties {
  trail?: (TrailEntry | null)[];
  children: {
    current?: ReactNode;
    actions?: ReactNode;
  };
}

const Breadcrumbs = ({ trail, children: { current = null, actions = null } }: BreadcrumbsProperties) => {
  const [searchParams] = useSearchParams();
  const backPath = searchParams.get('backPath');
  const backLabel = searchParams.get('backLabel');

  const isSmallScreen = useSmallScreen();

  const filteredTrail = useMemo(() => filterNullish(trail), [trail]);

  const backTrail: ReactNode[] = useMemo(() => {
    const finalTrail = backPath && backLabel ? [{ to: backPath, label: backLabel }] : (filteredTrail ?? []);
    if (finalTrail.length === 0) {
      return [null];
    }

    if (isSmallScreen) {
      return [
        <Link
          key="breadcrumb-back"
          underline="hover"
          color="inherit"
          href={finalTrail[finalTrail.length - 1].to}
          sx={{ cursor: 'pointer' }}
        >
          <Typography
            variant="h6"
            sx={{
              alignItems: 'center',
              display: 'flex',
              minWidth: 0
            }}
          >
            <ArrowBackIcon />
          </Typography>
        </Link>
      ];
    }

    return finalTrail
      ? finalTrail.map((entry, index) => (
          <Link
            key={`breadcrumb-${index}`}
            underline="hover"
            color="inherit"
            href={entry.to}
            sx={{ cursor: 'pointer' }}
          >
            <Typography
              variant="h6"
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              {entry.label}
            </Typography>
          </Link>
        ))
      : [null];
  }, [backLabel, backPath, filteredTrail, isSmallScreen]);

  const renderedCurrent = useMemo(
    () => (
      <Box key="current" sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <Typography variant="h6" color="text.primary" sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          {current}
        </Typography>
      </Box>
    ),
    [current]
  );

  return isSmallScreen ? (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        {backTrail}
        {renderedCurrent}
      </Box>
      {actions}
    </Box>
  ) : (
    <MuiBreadcrumbs aria-label="breadcrumb" separator="›" classes={{ root: 'breadcrumbs-root', li: 'breadcrumbs-li' }}>
      {backTrail}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {renderedCurrent}
        {actions}
      </Box>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
