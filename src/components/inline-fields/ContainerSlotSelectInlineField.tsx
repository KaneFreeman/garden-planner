import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useContainerOptions from '../../containers/hooks/useContainerOptions';
import { useContainer } from '../../containers/hooks/useContainers';
import { ContainerSlotIdentifier } from '../../interface';
import { useLocationTitle } from '../../utility/containerSlotLocation.util';
import { isNullish } from '../../utility/null.util';
import Select from '../Select';

interface ContainerSlotSelectInlineFieldProps {
  label: React.ReactNode;
  value: ContainerSlotIdentifier | null;
  containerId: string;
  slotId: number;
  onChange(value: ContainerSlotIdentifier | null): void;
}

const ContainerSlotSelectInlineField = ({
  label,
  value,
  containerId,
  slotId,
  onChange
}: ContainerSlotSelectInlineFieldProps) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | null | undefined>(value?.containerId ?? null);

  useEffect(() => {
    if (value?.containerId !== internalValue) {
      setInternalValue(value?.containerId ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(
    (save: boolean) => () => {
      setOpen(false);
      if (internalValue !== value) {
        if (save) {
          if (isNullish(internalValue)) {
            onChange(null);
          } else {
            navigate(`/container/${containerId}/slot/${slotId}/transplant/${internalValue}`);
          }
        } else {
          setInternalValue(value?.containerId ?? null);
        }
      }
    },
    [containerId, internalValue, navigate, onChange, slotId, value]
  );

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (value) {
        event.stopPropagation();
        navigate(`/container/${value.containerId}/slot/${value.slotId}`);
      }
    },
    [navigate, value]
  );

  const transplantContainer = useContainer(value?.containerId);

  const containerOptions = useContainerOptions();

  const title = useLocationTitle(value, transplantContainer);

  return (
    <>
      <Box onClick={open ? undefined : handleOpen}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ flexGrow: 1, mt: 2, display: 'flex', alignItems: 'center' }}
          color="GrayText"
        >
          {label}
        </Typography>
        <Typography variant="body1" component="div" sx={{ ml: -2, mr: -2 }}>
          <ListItem button key="container-slot-select-display" onClick={open ? undefined : handleOpen}>
            {transplantContainer && value ? (
              <Button variant="text" onClick={onClick} sx={{ ml: -1 }}>
                <Box component="span">{title}</Box>
              </Button>
            ) : (
              'N/A'
            )}
          </ListItem>
        </Typography>
      </Box>
      <Dialog open={open} onClose={handleClose(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          <form name="container-slot-select-modal-form" onSubmit={handleClose(true)} noValidate>
            <Box sx={{ display: 'flex', mt: 1, mb: 2, gap: 1 }}>
              <Select
                label="Container"
                value={internalValue ?? undefined}
                onChange={(otherContainerId) => setInternalValue(otherContainerId)}
                options={containerOptions}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose(false)}>Cancel</Button>
          <Button onClick={handleClose(true)} variant="contained">
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlotSelectInlineField;
