import useMediaQuery from '@mui/material/useMediaQuery';

export function useSmallScreen() {
  return useMediaQuery('(max-width:600px)');
}

export function useLargeScreen() {
  return useMediaQuery('(min-width:1200px)');
}
