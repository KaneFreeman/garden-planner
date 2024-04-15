import { useCallback, useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const LoginPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignUpClick = useCallback(() => {
    setShowSignUp(true);
  }, []);

  const handleLoginClick = useCallback(() => {
    setShowSignUp(false);
  }, []);

  return showSignUp ? <SignUp onLoginClick={handleLoginClick} /> : <Login onSignUpClick={handleSignUpClick} />;
};

export default LoginPage;
