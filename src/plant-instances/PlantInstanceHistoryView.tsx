/* eslint-disable react/no-array-index-key */
import { useMemo } from 'react';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import GrassIcon from '@mui/icons-material/Grass';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { ContainerSlotIdentifier, HARVESTED, PLANTED, PlantInstance, TRANSPLANTED } from '../interface';
import { getMidnight } from '../utility/date.util';
import { areContainerSlotLocationsEqual, getLocationTitle } from '../utility/containerSlotLocation.util';
import { useContainersById } from '../containers/hooks/useContainers';
import './PlantInstanceHistoryView.css';

interface PlantInstanceHistoryViewProps {
  slotLocation?: ContainerSlotIdentifier | null;
  plantInstance: PlantInstance | undefined;
}

const PlantInstanceHistoryView = ({ plantInstance, slotLocation }: PlantInstanceHistoryViewProps) => {
  const history = useMemo(() => plantInstance?.history ?? [], [plantInstance]);
  const today = useMemo(() => getMidnight().getTime(), []);
  const containersById = useContainersById();

  if (history.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
        color="GrayText"
      >
        Timeline
      </Typography>
      <Timeline classes={{ root: 'timeline-root' }}>
        {history.map((historyItem, historyItemIndex) => {
          let date = format(historyItem.date, 'MMMM d');
          if (historyItem.date.getTime() > today) {
            date += ` (in ${formatDistance(historyItem.date, today)})`;
          } else if (historyItem.date.getTime() === today) {
            date += ` (today)`;
          } else {
            date += ` (${formatDistance(historyItem.date, today)} ago)`;
          }

          let extra = '';
          if (historyItem.status === TRANSPLANTED) {
            if (areContainerSlotLocationsEqual(historyItem.from, slotLocation)) {
              extra = historyItem.to
                ? ` to ${getLocationTitle(
                    historyItem.to,
                    historyItem.to ? containersById[historyItem.to.containerId] : undefined
                  )}`
                : '';
            } else if (areContainerSlotLocationsEqual(historyItem.to, slotLocation)) {
              extra = historyItem.from
                ? ` from ${getLocationTitle(
                    historyItem.from,
                    historyItem.from ? containersById[historyItem.from.containerId] : undefined
                  )}`
                : '';
            } else {
              if (historyItem.from) {
                extra = ` from ${getLocationTitle(
                  historyItem.from,
                  historyItem.from ? containersById[historyItem.from.containerId] : undefined
                )}`;
              }

              if (historyItem.to) {
                extra += ` to ${getLocationTitle(
                  historyItem.to,
                  historyItem.to ? containersById[historyItem.to.containerId] : undefined
                )}`;
              }
            }
          }

          return (
            <TimelineItem key={`history-item-${historyItemIndex}`} classes={{ root: 'timelineItem-root' }}>
              <TimelineSeparator>
                <TimelineConnector />
                {historyItem.status === PLANTED ? (
                  <TimelineDot key={`history-item-${historyItemIndex}-planted`} color="success">
                    <GrassIcon />
                  </TimelineDot>
                ) : null}
                {historyItem.status === TRANSPLANTED ? (
                  <TimelineDot key={`history-item-${historyItemIndex}-transplanted`} color="error">
                    <MoveDownIcon />
                  </TimelineDot>
                ) : null}
                {historyItem.status === HARVESTED ? (
                  <TimelineDot key={`history-item-${historyItemIndex}-harvested`} color="info">
                    <AgricultureIcon />
                  </TimelineDot>
                ) : null}
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="subtitle1" component="span">
                  {historyItem.status}
                  {extra}
                </Typography>
                <Typography variant="body2" color="GrayText">
                  {date}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default PlantInstanceHistoryView;
