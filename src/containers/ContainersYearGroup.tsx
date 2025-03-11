import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Box } from '@mui/system';
import { FC, PropsWithChildren } from 'react';
import Chip from '../components/Chip';
import { generateTagColor } from '../utility/color.util';

export interface ContainersYearGroupProps {
  year: string;
}

const ContainersYearGroup: FC<PropsWithChildren<ContainersYearGroupProps>> = ({ year, children }) => {
  return (
    <Accordion key={`containers-by-year-${year}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip title={`${year}`} colors={generateTagColor(year)}>
            {year}
          </Chip>
          Containers
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default ContainersYearGroup;
