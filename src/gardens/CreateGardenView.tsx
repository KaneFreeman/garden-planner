import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { FormEvent } from 'react';
import { useAddGarden } from './useGardens';

const CreateGardenView = () => {
  const addGarden = useAddGarden();

  const handleAddGarden = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    addGarden({
      name: data.get('name')?.toString() ?? ''
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70dvh'
        }}
      >
        <img src="/favicon64.png" />
        <Box component="form" onSubmit={handleAddGarden} sx={{ mt: 2, width: '100%' }}>
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField required fullWidth id="name" name="name" label="Name" autoFocus />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Create Garden
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateGardenView;
