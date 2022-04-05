import { useNavigate } from 'react-router';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { useContainers } from './useContainers';

const Containers = () => {
  const navigate = useNavigate();
  const containers = useContainers();

  return (
    <Box sx={{ width: '100%' }}>
      <nav aria-label="main containers">
        <List>
          {containers.map((container) => (
            <ListItem key={`container-${container._id}`} disablePadding>
              <ListItemButton onClick={() => navigate(`/container/${container._id}`)}>
                <ListItemAvatar>
                  <Avatar>
                    <InboxIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={container.name} secondary={`${container.rows} x ${container.columns}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
};

export default Containers;
