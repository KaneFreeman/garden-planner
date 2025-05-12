import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useCallback, useState } from 'react';
import Copyright from '../components/Copyright';
import Logo from './Logo';
import { useLogin } from './useAuth';

export interface TokenProps {
  email: string;
  onNotYouClick: () => void;
  onUseTokenClick: (email: string) => void;
}

const LoginWithPassword = ({ email, onNotYouClick, onUseTokenClick }: TokenProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const login = useLogin();

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setLoading(true);
      const data = new FormData(event.currentTarget);

      const response = await login({
        email,
        password: data.get('password')?.toString() ?? ''
      });

      if (response !== true) {
        setError(response);
      }

      setLoading(false);
    },
    [email, login]
  );

  const handleUseTokenClick = useCallback(() => {
    onUseTokenClick(email);
  }, [email, onUseTokenClick]);

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
        <Logo />
        <Typography variant="body1" sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 3 }}>
          Logging in as {email}.
          <Link
            component="button"
            variant="body1"
            onClick={onNotYouClick}
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Not you?
          </Link>
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: '100%' }}>
          {error ? (
            <Alert severity="error" sx={{ mt: 1, mb: 3 }}>
              {error}
            </Alert>
          ) : null}
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              disabled={loading}
              autoFocus
            />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            Login
          </Button>
        </Box>
        <Link
          component="button"
          variant="body2"
          onClick={handleUseTokenClick}
          sx={{
            mt: 2,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          disabled={loading}
        >
          Login with code
        </Link>
        <Copyright sx={{ mt: 4 }} />
      </Box>
    </Container>
  );
};

export default LoginWithPassword;
