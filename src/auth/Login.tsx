import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { FormEvent, useCallback, useState } from 'react';
import Copyright from '../components/Copyright';
import Logo from './Logo';
import { useGenerateToken } from './useAuth';

export interface LoginProps {
  onSignUpClick: () => void;
  onNextClick: (email: string) => void;
}

const Login = ({ onSignUpClick, onNextClick }: LoginProps) => {
  const [generatingToken, setGeneratingToken] = useState(false);
  const [error, setError] = useState<string | false>(false);

  const generateToken = useGenerateToken();

  const handleNext = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (generatingToken) {
        return;
      }

      setGeneratingToken(true);

      const data = new FormData(event.currentTarget);

      const email = data.get('email')?.toString() ?? '';
      const response = await generateToken({
        email
      });

      if (response !== true) {
        setError(response);
        setGeneratingToken(false);
        return;
      }

      onNextClick(email);

      setGeneratingToken(false);
    },
    [generateToken, generatingToken, onNextClick]
  );

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
        <Box component="form" onSubmit={handleNext} sx={{ mt: 2, width: '100%' }}>
          {error ? (
            <Alert severity="error" sx={{ mt: 1, mb: 3 }}>
              {error}
            </Alert>
          ) : null}
          <Box sx={{ width: '100%', mt: 2 }}>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              type="email"
              disabled={generatingToken}
              autoFocus
            />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={generatingToken}>
            Next
          </Button>
        </Box>
        <Link
          component="button"
          variant="body2"
          onClick={onSignUpClick}
          sx={{
            mt: 2,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          disabled={generatingToken}
        >
          No account? Create one
        </Link>
        <Copyright sx={{ mt: 4 }} />
      </Box>
    </Container>
  );
};

export default Login;
