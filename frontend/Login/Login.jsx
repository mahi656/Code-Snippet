import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignInPage as FullSignInPage } from '../src/components/ui/sign-in.jsx';
import photo from '../src/Photos/code.jpg';

export const Login = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen bg-black"
    >
      <FullSignInPage
        title={<span className="font-light text-foreground tracking-tighter">Welcome</span>}
        description="Access your account and continue your journey with us"
        onSignIn={(e) => {
          e.preventDefault();
          // actual signup logic
          // alert("Sign Up form submitted!");
        }}
        onCreateAccount={() => navigate('/signup')}
        // onGoogleSignIn={() => {
        //   alert("Google Sign Up clicked");
        // }}
        heroImageSrc={photo}
      />
    </motion.div>
  );
};

export default Login;

