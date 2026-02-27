import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignUpPage as FullSignUpPage } from '../src/components/ui/sign-up.tsx';
import photo from '../src/Photos/code.jpg';

export const Signup = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen bg-black"
        >
            <FullSignUpPage
                title={<span className="font-light text-foreground tracking-tighter">Create Account</span>}
                description="Access your account and continue your journey with us"
                onSignUp={(e) => {
                    e.preventDefault();
                    // actual signup logic
                    // alert("Sign Up form submitted!");
                }}
                onSignIn={() => navigate('/login')}
                heroImageSrc={photo}
            />
        </motion.div>
    );
};

export default Signup;
