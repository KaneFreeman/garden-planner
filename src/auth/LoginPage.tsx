import { useCallback, useState } from 'react';
import Login from './Login';
import LoginWithPassword from './LoginWithPassword';
import LoginWithToken from './LoginWithToken';
import SignUp from './SignUp';

interface LoginPageState {
  email?: string;
  view: 'login' | 'signup' | 'token' | 'password';
}

const LoginPage = () => {
  const [state, setState] = useState<LoginPageState>({ view: 'login' });

  const handleSignUpClick = useCallback(() => {
    setState({ view: 'signup' });
  }, []);

  const handleLoginClick = useCallback(() => {
    setState({ view: 'login' });
  }, []);

  const handleUseTokenClick = useCallback((email: string) => {
    setState({ view: 'token', email });
  }, []);

  const handleUsePasswordClick = useCallback((email: string) => {
    setState({ view: 'password', email });
  }, []);

  if (state.view === 'token' && state.email) {
    return (
      <LoginWithToken
        email={state.email}
        onUsePasswordClick={handleUsePasswordClick}
        onNotYouClick={handleLoginClick}
      />
    );
  }

  if (state.view === 'password' && state.email) {
    return (
      <LoginWithPassword email={state.email} onNotYouClick={handleLoginClick} onUseTokenClick={handleUseTokenClick} />
    );
  }

  if (state.view === 'signup') {
    return <SignUp onLoginClick={handleLoginClick} />;
  }

  return <Login onSignUpClick={handleSignUpClick} onNextClick={handleUseTokenClick} />;
};

export default LoginPage;
