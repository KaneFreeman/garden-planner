import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
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
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img src="/favicon64.png" />
        <Box component="form" onSubmit={handleAddGarden} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField required fullWidth id="name" name="name" label="Name" autoFocus />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Create Garden
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateGardenView;
