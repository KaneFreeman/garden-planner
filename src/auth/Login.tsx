import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useState } from 'react';
import Copyright from '../components/Copyright';
import { useLogin } from './useAuth';

export interface LoginProps {
  onSignUpClick: () => void;
}

const Login = ({ onSignUpClick }: LoginProps) => {
  const [error, setError] = useState<string | false>(false);
  const login = useLogin();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const response = await login({
      email: data.get('email')?.toString() ?? '',
      password: data.get('password')?.toString() ?? ''
    });

    if (response !== true) {
      setError(response);
    }
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
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : null}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                type="email"
                autoFocus
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
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component="button" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component="button" variant="body2" onClick={onSignUpClick}>
                {'No account? Create one'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default Login;
