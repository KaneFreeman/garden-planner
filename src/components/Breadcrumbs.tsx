/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { ReactNode, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { filterNullish } from '../utility/null.util';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backPath = searchParams.get('backPath');
  const backLabel = searchParams.get('backLabel');

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const filteredTrail = useMemo(() => filterNullish(trail), [trail]);

  const backTrail: ReactNode[] = useMemo(() => {
    const finalTrail = backPath && backLabel ? [{ to: backPath, label: backLabel }] : filteredTrail ?? [];
    if (finalTrail.length === 0) {
      return [null];
    }

    if (isSmallScreen) {
      return [
        <Link
          key="breadcrumb-back"
          underline="hover"
          color="inherit"
          onClick={() => navigate(finalTrail[finalTrail.length - 1].to)}
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
            onClick={() => navigate(entry.to)}
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
  }, [backLabel, backPath, filteredTrail, isSmallScreen, navigate]);

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
