import React, { useState } from 'react';
import { Eye, EyeOff, Github, Check } from 'lucide-react';
import { motion } from 'framer-motion';

import Side1 from '../../Photos/Side1.png';
import Side2 from '../../Photos/Side2.png';

const GithubIcon = () => (
    <Github className="h-5 w-5" />
);


// --- TYPE DEFINITIONS ---

interface SignInPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGithubSignIn?: () => void;
    onResetPassword?: () => void;
    onCreateAccount?: () => void;
    isLoading?: boolean;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-lg border border-[#27272a] bg-[#09090b] transition-all hover:bg-[#121212] focus-within:border-[#a78bfa] focus-within:ring-1 focus-within:ring-[#a78bfa]/50">
        {children}
    </div>
);



// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
    title = <span className="font-light text-foreground dark:text-white tracking-tighter">Welcome</span>,
    description = "Access your account and continue your journey with us",
    heroImageSrc,
    onSignIn,
    onGithubSignIn,
    onResetPassword,
    onCreateAccount,
    isLoading = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-black">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <h1 className="animate-element animate-delay-100 text-5xl font-normal leading-tight text-white mb-2">{title}</h1>
                        <p className="animate-element animate-delay-200 text-[#a1a1aa] text-[15px]">{description}</p>

                        <form className="space-y-4 mt-6" onSubmit={onSignIn} noValidate>
                            <div className="animate-element animate-delay-300">
                                <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5 flex items-center gap-1">Email <span className="text-red-500">*</span></label>
                                <GlassInputWrapper>
                                    <input name="email" type="email" placeholder="you@example.com" className="w-full bg-transparent text-[14px] px-4 py-3 rounded-lg focus:outline-none text-white placeholder:text-[#52525b]" required />
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-400">
                                <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5 flex items-center gap-1">Password <span className="text-red-500">*</span></label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-[14px] px-4 py-3 pr-10 rounded-lg focus:outline-none text-white placeholder:text-[#52525b]" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                                            {showPassword ? <EyeOff strokeWidth={2} className="w-[18px] h-[18px] text-[#52525b] hover:text-[#a1a1aa] transition-colors" /> : <Eye strokeWidth={2} className="w-[18px] h-[18px] text-[#52525b] hover:text-[#a1a1aa] transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setRememberMe(!rememberMe)}
                                        className={`w-[18px] h-[18px] rounded-full border transition-all duration-200 flex items-center justify-center ${rememberMe
                                            ? 'bg-[#a78bfa] border-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,0.3)]'
                                            : 'border-[#3f3f46] bg-[#0f0f0f] group-hover:border-[#71717a]'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="opacity-0 absolute w-0 h-0"
                                        />
                                        {rememberMe && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                                    </div>
                                    <span className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors text-[13px]">Keep me signed in</span>
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] text-[13px] transition-colors font-medium">Reset password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="animate-element animate-delay-600 w-full rounded-lg bg-white/90 hover:bg-white py-3 font-medium text-black transition-colors mt-4 text-[14px] shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </button>
                        </form>

                        <div className="animate-element animate-delay-700 relative flex items-center justify-center mt-4">
                            <span className="w-full border-t border-[#27272a]"></span>
                            <span className="px-5 text-[14px] text-[#a1a1aa] bg-black absolute">Or continue with</span>
                        </div>

                        <button onClick={onGithubSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-2 border border-[#27272a] rounded-lg py-3 hover:bg-[#121212] transition-colors text-white font-medium mt-2 text-[14px]">
                            <GithubIcon />
                            Continue with GitHub
                        </button>

                        <p className="animate-element animate-delay-900 text-center text-[15px] text-[#a1a1aa] mt-4">
                            New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">Create Account</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: Overlapping Images */}
            <section className="hidden md:block flex-1 relative p-4">
                <div className="absolute inset-4 rounded-3xl overflow-hidden flex items-center justify-center">
                    {/* Abstract glows */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#a78bfa]/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[100px]" />

                    {/* Image composition */}
                    <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -60, y: 30, rotate: -5 }}
                            animate={{ opacity: 1, x: -30, y: 20, rotate: -2 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="absolute top-4 left-4 w-3/5 aspect-[4/5] z-10 hover:z-30 transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-black/50 to-transparent z-10 pointer-events-none" />
                            <img src={Side1} alt="Preview 1" className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/5" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 60, y: -30, rotate: 5 }}
                            animate={{ opacity: 1, x: 30, y: -20, rotate: 3 }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="absolute bottom-4 right-4 w-3/5 aspect-[4/5] z-20 hover:z-30 transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <img src={Side2} alt="Preview 2" className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/50 border border-white/5" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};
