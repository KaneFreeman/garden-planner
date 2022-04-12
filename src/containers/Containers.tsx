import { useNavigate } from 'react-router';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
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
                    {container.type === 'Inside' ? (
                      <HomeIcon titleAccess="Inside" />
                    ) : (
                      <ParkIcon titleAccess="Inside" />
                    )}
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
