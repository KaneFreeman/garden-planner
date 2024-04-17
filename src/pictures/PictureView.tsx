import React, { useCallback, useMemo, useState } from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ImageProps {
  size: number | string;
}

const Image = styled('img')<ImageProps>(({ size }) => {
  if (size === 'full') {
    return { objectFit: 'cover', maxWidth: '100vw', maxHeight: '100dvh' };
  }

  return { objectFit: 'cover', width: size, height: size };
});

interface PictureProps {
  picture: string;
  alt: string;
  size?: 'small' | 'large' | 'full';
  onClick?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  sx?: SxProps<Theme> | undefined;
}

const PictureView = ({ picture, alt, size = 'large', onClick, onDelete, onSetDefault, sx }: PictureProps) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const hasContextMenu = useMemo(() => onDelete || onSetDefault, [onDelete, onSetDefault]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (hasContextMenu) {
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4
              }
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
              // Other native context menus might behave different.
              // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
              null
        );
      }
    },
    [contextMenu, hasContextMenu]
  );

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleOnDeleteConfirm = useCallback(() => {
    setContextMenu(null);
    onDelete?.();
  }, [onDelete]);

  const handleOnSetDefault = useCallback(() => {
    setContextMenu(null);
    onSetDefault?.();
  }, [onSetDefault]);

  const imageSize = useMemo(() => {
    switch (size) {
      case 'full':
        return 'full';
      case 'small':
        return 100;
      default:
        return 230;
    }
  }, [size]);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'flex-start', ...sx }}
      onClick={contextMenu == null ? onClick : undefined}
      onContextMenu={handleContextMenu}
      style={{ cursor: onClick ? 'pointer' : 'context-menu' }}
    >
      <Image src={picture} alt={alt} size={imageSize} />
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        {onDelete ? <MenuItem onClick={handleOnDeleteConfirm}>Remove</MenuItem> : null}
        {onSetDefault ? <MenuItem onClick={handleOnSetDefault}>Set Default</MenuItem> : null}
      </Menu>
    </Box>
  );
};

export default PictureView;
