import React from 'react';
import { useNavigate } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { ContainersCollection } from '../../api/Containers';

const Containers = () => {
  const navigate = useNavigate();

  const containers = useTracker(() =>
    ContainersCollection.find()
      .fetch()
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
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
