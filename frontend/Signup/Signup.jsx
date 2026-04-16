import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignUpPage as FullSignUpPage } from '../src/components/ui/sign-up.tsx';
import api, { API_BASE_URL } from '../src/api/api';
import toast from 'react-hot-toast';

export const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const fullName = formData.get('fullName');
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await api.post('/auth/signup', {
                fullName,
                username,
                email,
                password
            });

            if (response.data.success) {
                toast.success('Account created successfully!');
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
            const errorMessage = error.response?.data?.message || 'Failed to sign up';
            toast.error(errorMessage);
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
            <FullSignUpPage
                title={<span className="font-light text-white tracking-tighter">Create Account</span>}
                description="Access your account and continue your journey with us"
                onSignUp={handleSignUp}
                onGithubSignUp={() => {
                    window.location.href = `${API_BASE_URL}/OAuth/github`;
                }}
                onSignIn={() => navigate('/login')}
                isLoading={isLoading}
            />
        </motion.div>
    );
};

export default Signup;
