import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useState } from 'react';
import Copyright from '../components/Copyright';
import { useSignUp } from './useAuth';
import Alert from '@mui/material/Alert';

export interface SignUpProps {
  onLoginClick: () => void;
}

const SignUp = ({ onLoginClick }: SignUpProps) => {
  const [error, setError] = useState<string | false>(false);
  const signUp = useSignUp();

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(false);

    const data = new FormData(event.currentTarget);

    const response = await signUp({
      email: data.get('email')?.toString() ?? '',
      password: data.get('password')?.toString() ?? '',
      firstName: data.get('firstName')?.toString() ?? '',
      lastName: data.get('lastName')?.toString() ?? ''
    });

    if (response !== true) {
      setError(response);
      return;
    }

    onLoginClick();
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
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 3 }}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : null}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                inputProps={{
                  minlength: '8'
                }}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Create Account
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component="button" variant="body2" onClick={onLoginClick}>
                Already have an account? Login in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default SignUp;
