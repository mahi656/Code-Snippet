import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignInPage as FullSignInPage } from '../src/components/ui/sign-in.tsx';
import api, { API_BASE_URL } from '../src/api/api';
import { toast } from '../src/components/ui/Notification.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      setIsLoading(false);
      toast('Please enter both email and password', 'error');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        toast('Logged in successfully!', 'success');
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('username', response.data.data.user.username);

        // Allow user to see the success toast before navigating
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || 'Failed to login';
      toast(errorMessage, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen bg-black"
    >
      <FullSignInPage
        title={<span className="font-light text-white tracking-tighter">Welcome</span>}
        description="Access your account and continue your journey with us"
        onSignIn={handleSignIn}
        onGithubSignIn={() => {
          window.location.href = `${API_BASE_URL}/OAuth/github`;
        }}
        onCreateAccount={() => navigate('/signup')}
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default Login;

