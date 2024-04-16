import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useCallback, useState } from 'react';
import Copyright from '../components/Copyright';
import { useGenerateToken, useLoginWithToken } from './useAuth';

export interface TokenProps {
  email: string;
  onNotYouClick: () => void;
  onUsePasswordClick: (email: string) => void;
}

const LoginWithToken = ({ email, onNotYouClick, onUsePasswordClick }: TokenProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const [message, setMessage] = useState<string | false>(false);

  const login = useLoginWithToken();
  const generateToken = useGenerateToken();

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      setLoading(true);
      const data = new FormData(event.currentTarget);

      const response = await login({
        email,
        token: data.get('token')?.toString() ?? ''
      });

      if (response !== true) {
        setError(response);
        setLoading(false);
        return;
      }

      setLoading(false);
    },
    [email, loading, login]
  );

  const handleUsePasswordClick = useCallback(() => {
    onUsePasswordClick(email);
  }, [email, onUsePasswordClick]);

  const handleResendCode = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const response = await generateToken({
      email
    });

    if (response !== true) {
      setError(response);
      setLoading(false);
      return;
    }

    setMessage('Verification code sent.');
    setLoading(false);
  }, [email, generateToken, loading]);

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
            No you?
          </Link>
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: '100%' }}>
          {error ? (
            <Alert severity="error" sx={{ mt: 1, mb: 3 }}>
              {error}
            </Alert>
          ) : null}
          {message ? (
            <Alert severity="info" sx={{ mt: 1, mb: 3 }}>
              {message}
            </Alert>
          ) : null}
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField required fullWidth id="token" name="token" label="Code" disabled={loading} autoFocus />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            Next
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleUsePasswordClick}
            sx={{
              mt: 2,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            disabled={loading}
          >
            Login with password
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={handleResendCode}
            sx={{
              mt: 2,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            disabled={loading}
          >
            Resend code
          </Link>
        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Box>
    </Container>
  );
};

export default LoginWithToken;
