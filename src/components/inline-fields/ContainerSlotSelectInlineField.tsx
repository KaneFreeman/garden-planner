import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useContainer, useGetContainers } from '../../containers/useContainers';
import getSlotTitle from '../../utility/slot.util';
import Select from '../Select';
import { ContainerSlotIdentifier } from '../../interface';
import { useAppSelector } from '../../store/hooks';
import { selectContainer, selectContainers } from '../../store/slices/containers';

interface ContainerSlotSelectInlineFieldProps {
  label: React.ReactNode;
  value: ContainerSlotIdentifier | null;
  onChange(value: ContainerSlotIdentifier | null): void;
}

const ContainerSlotSelectInlineField = ({ label, value, onChange }: ContainerSlotSelectInlineFieldProps) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Partial<ContainerSlotIdentifier> | null>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
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
          onChange(
            internalValue?.containerId !== undefined && internalValue?.slotId !== undefined
              ? (internalValue as ContainerSlotIdentifier)
              : null
          );
        } else {
          setInternalValue(value);
        }
      }
    },
    [internalValue, onChange, value]
  );

  const handleOnChange = useCallback(
    (newValue: Partial<ContainerSlotIdentifier>) => {
      setInternalValue({ ...internalValue, ...newValue });
    },
    [internalValue]
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

  const transplantContainerSelector = useMemo(() => selectContainer(value?.containerId), [value?.containerId]);
  const transplantContainer = useAppSelector(transplantContainerSelector);

  const internalTransplantContainer = useContainer(internalValue?.containerId);
  const containers = useAppSelector(selectContainers);
  const getContainers = useGetContainers();
  const slotOptions = useMemo(
    () =>
      internalTransplantContainer
        ? [...Array(internalTransplantContainer.rows * internalTransplantContainer.columns)].map((_, entry) => ({
            label: getSlotTitle(entry, internalTransplantContainer.rows),
            value: entry
          }))
        : [],
    [internalTransplantContainer]
  );

  useEffect(() => {
    if (open) {
      getContainers();
    }
  }, [getContainers, open])

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
                <Box component="span">
                  {transplantContainer.name} - {getSlotTitle(value.slotId, transplantContainer.rows)}
                </Box>
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
                value={internalValue?.containerId}
                onChange={(containerId) => {
                  if (internalValue?.containerId !== containerId) {
                    handleOnChange({ containerId, slotId: undefined });
                  }
                }}
                options={containers?.map((entry) => ({
                  label: entry.name,
                  value: entry._id
                }))}
              />
              <Select
                label="Slot"
                value={internalValue?.slotId}
                onChange={(slotId) => handleOnChange({ slotId })}
                disabled={slotOptions.length === 0}
                options={slotOptions}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose(false)}>Cancel</Button>
          <Button onClick={handleClose(true)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContainerSlotSelectInlineField;
