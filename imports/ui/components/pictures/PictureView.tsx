import React, { useCallback, useMemo } from 'react';
import { Box, Menu, MenuItem, styled } from '@mui/material';

interface ImageProps {
  size: number | string;
}

const Image = styled('img')<ImageProps>(({ size }) => ({ objectFit: 'cover', width: size, height: size }));

interface PictureProps {
  picture: string;
  alt: string;
  size?: 'small' | 'large' | 'original';
  onClick?: () => void;
  onDelete?: () => void;
}

const PictureView = ({ picture, alt, size = 'large', onClick, onDelete }: PictureProps) => {
  const handleOnDeleteConfirm = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    if (onDelete) {
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
  }, [contextMenu, onDelete]);

  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  const imageSize = useMemo(() => {
    switch (size) {
      case 'original':
        return 'unset';
      case 'small':
        return 100;
      default:
        return 230;
    }
  }, [size]);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'flex-start' }}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      style={{ cursor: 'context-menu' }}
    >
      <Image src={picture} alt={alt} size={imageSize} />
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem onClick={handleOnDeleteConfirm}>Remove</MenuItem>
      </Menu>
    </Box>
  );
};

export default PictureView;
