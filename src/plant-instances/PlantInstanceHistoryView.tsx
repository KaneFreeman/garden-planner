import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrassIcon from '@mui/icons-material/Grass';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import YardIcon from '@mui/icons-material/Yard';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format, formatDistance } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useContainersById } from '../containers/hooks/useContainers';
import {
  ContainerSlotIdentifier,
  FERTILIZED,
  HARVESTED,
  PLANTED,
  PlantInstance,
  PlantInstanceHistory,
  TRANSPLANTED
} from '../interface';
import { areContainerSlotLocationsEqual, getLocationTitle } from '../utility/containerSlotLocation.util';
import { getMidnight } from '../utility/date.util';
import './PlantInstanceHistoryView.css';

interface PlantInstanceHistoryViewProps {
  slotLocation?: ContainerSlotIdentifier | null;
  plantInstance: PlantInstance | undefined;
}

const PlantInstanceHistoryView = ({ plantInstance, slotLocation }: PlantInstanceHistoryViewProps) => {
  const history = useMemo(() => plantInstance?.history ?? [], [plantInstance]);
  const today = useMemo(() => getMidnight().getTime(), []);
  const containersById = useContainersById();
  const navigate = useNavigate();

  const navigateToLocation = useCallback(
    (location: ContainerSlotIdentifier | undefined) => {
      if (location) {
        navigate(`/container/${location.containerId}/slot/${location.slotId}${location.subSlot ? '/sub-slot' : ''}`);
        return true;
      }

      return false;
    },
    [navigate]
  );

  const onClick = useCallback(
    (historyItem: PlantInstanceHistory) => () => {
      if (historyItem.status === TRANSPLANTED || historyItem.status === PLANTED) {
        if (navigateToLocation(historyItem.to)) {
          return;
        }

        navigateToLocation(historyItem.from);
        return;
      }

      if (historyItem.status === HARVESTED) {
        navigateToLocation(historyItem.from);
      }
    },
    [navigateToLocation]
  );

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
              extra = ` from here${
                historyItem.to
                  ? ` to ${getLocationTitle(
                      historyItem.to,
                      historyItem.to ? containersById[historyItem.to.containerId] : undefined
                    )}`
                  : ''
              }`;
            } else if (areContainerSlotLocationsEqual(historyItem.to, slotLocation)) {
              extra = `${
                historyItem.from
                  ? ` from ${getLocationTitle(
                      historyItem.from,
                      historyItem.from ? containersById[historyItem.from.containerId] : undefined
                    )}`
                  : ''
              } to here`;
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
          } else if (historyItem.status === PLANTED) {
            if (historyItem.to) {
              extra += ` in ${getLocationTitle(
                historyItem.to,
                historyItem.to ? containersById[historyItem.to.containerId] : undefined
              )}`;
            }
          } else if (historyItem.status === HARVESTED) {
            if (historyItem.from) {
              extra = ` from ${getLocationTitle(
                historyItem.from,
                historyItem.from ? containersById[historyItem.from.containerId] : undefined
              )}`;
            }
          } else if (historyItem.status === FERTILIZED) {
            if (historyItem.from) {
              extra = ` in ${getLocationTitle(
                historyItem.from,
                historyItem.from ? containersById[historyItem.from.containerId] : undefined
              )}`;
            }
          }

          return (
            <TimelineItem
              key={`history-item-${historyItemIndex}`}
              classes={{ root: 'timelineItem-root' }}
              onClick={onClick(historyItem)}
              sx={{ cursor: 'pointer' }}
            >
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
                {historyItem.status === FERTILIZED ? (
                  <TimelineDot key={`history-item-${historyItemIndex}-fertilized`} color="info">
                    <YardIcon />
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
