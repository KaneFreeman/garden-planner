import useMediaQuery from "@mui/material/useMediaQuery";

export default function useSmallScreen() {
  return useMediaQuery('(max-width:600px)');
}