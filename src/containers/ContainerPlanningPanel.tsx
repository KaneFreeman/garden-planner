import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { Plant } from '../interface';
import PlantAvatar from '../plants/PlantAvatar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSidepanelOpen, toggleSidepanel } from '../store/slices/global';
import { getPlantTitle } from '../utility/plant.util';

interface ActivePlantEntry {
  plant: Plant;
  count: number;
}

interface ContainerPlanningPanelProps {
  activePlants: ActivePlantEntry[];
  onPlantDragStart: (plantId: string) => void;
  onPlantDragEnd: () => void;
}

const ContainerPlanningPanel = memo(
  ({ activePlants, onPlantDragStart, onPlantDragEnd }: ContainerPlanningPanelProps) => {
    const collapsed = useAppSelector(selectSidepanelOpen);
    const dispatch = useAppDispatch();

    const onToggleCollapse = () => {
      dispatch(toggleSidepanel());
    };

    return (
      <Box
        sx={{
          width: collapsed ? 44 : 300,
          minWidth: collapsed ? 44 : 300,
          backgroundColor: (theme) => theme.palette.background.default,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'width 200ms ease-in-out'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            px: collapsed ? 0 : 1.5,
            py: 1,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          {!collapsed ? (
            <Typography variant="subtitle1" color="text.secondary">
              Plants
            </Typography>
          ) : null}
          <IconButton size="small" onClick={onToggleCollapse} title={collapsed ? 'Expand panel' : 'Collapse panel'}>
            {collapsed ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Box>

        {!collapsed ? (
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxHeight: 'calc(100dvh - 136px)',
              overflowY: 'auto'
            }}
          >
            {activePlants.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                No plants available.
              </Typography>
            ) : (
              activePlants.map(({ plant, count }) => (
                <Box
                  key={`active-plant-${plant._id}`}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/x-garden-plant-id', plant._id);
                    event.dataTransfer.setData('text/plain', plant._id);
                    event.dataTransfer.effectAllowed = 'move';
                    onPlantDragStart(plant._id);
                  }}
                  onDragEnd={onPlantDragEnd}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    cursor: 'grab',
                    userSelect: 'none'
                  }}
                  title={`Drag ${getPlantTitle(plant)}`}
                >
                  <PlantAvatar plant={plant} />
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="body2" noWrap>
                      {getPlantTitle(plant)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {count}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        ) : null}
      </Box>
    );
  }
);

export default ContainerPlanningPanel;
