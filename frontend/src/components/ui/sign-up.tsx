import React, { useState } from 'react';
import { Eye, EyeOff, Github } from 'lucide-react';

const GithubIcon = () => (
    <Github className="h-5 w-5" />
);


// --- TYPE DEFINITIONS ---

interface SignUpPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGithubSignUp?: () => void;
    onSignIn?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border border-[#27272a] bg-[#121212] transition-colors focus-within:border-white focus-within:bg-[#18181b]">
        {children}
    </div>
);



// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
    title = "Create Account",
    description = "Access your account and continue your journey with us",
    heroImageSrc,
    onSignUp,
    onGithubSignUp,
    onSignIn,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-background dark:bg-black">
            {/* Left column: sign-up form */}
            <section className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-4">
                        <h1 className="animate-element animate-delay-100 text-5xl font-normal leading-tight text-white mb-2">{title}</h1>
                        <p className="animate-element animate-delay-200 text-[#a1a1aa] text-[15px]">{description}</p>

                        <form className="space-y-4 mt-4" onSubmit={onSignUp}>
                            <div className="animate-element animate-delay-300">
                                <label className="block text-[14px] font-normal text-[#e4e4e7] mb-2">Full Name</label>
                                <GlassInputWrapper>
                                    <input name="fullName" type="text" placeholder="Enter your full name" className="w-full bg-transparent text-sm p-[18px] rounded-xl focus:outline-none text-white placeholder:text-[#52525b]" />
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-300">
                                <label className="block text-[14px] font-normal text-[#e4e4e7] mb-2">Email Address</label>
                                <GlassInputWrapper>
                                    <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-[18px] rounded-xl focus:outline-none text-white placeholder:text-[#52525b]" />
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-400">
                                <label className="block text-[14px] font-normal text-[#e4e4e7] mb-2">Password</label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" className="w-full bg-transparent text-sm p-[18px] pr-12 rounded-xl focus:outline-none text-white placeholder:text-[#52525b]" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center">
                                            {showPassword ? <EyeOff strokeWidth={1.5} className="w-5 h-5 text-[#52525b] hover:text-white transition-colors" /> : <Eye strokeWidth={1.5} className="w-5 h-5 text-[#52525b] hover:text-white transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-400">
                                <label className="block text-[14px] font-normal text-[#e4e4e7] mb-2">Confirm Password</label>
                                <GlassInputWrapper>
                                    <div className="relative">
                                        <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="w-full bg-transparent text-sm p-[18px] pr-12 rounded-xl focus:outline-none text-white placeholder:text-[#52525b]" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-4 flex items-center">
                                            {showConfirmPassword ? <EyeOff strokeWidth={1.5} className="w-5 h-5 text-[#52525b] hover:text-white transition-colors" /> : <Eye strokeWidth={1.5} className="w-5 h-5 text-[#52525b] hover:text-white transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-[#e5e5e5] hover:bg-white py-[18px] font-medium text-black transition-colors mt-4 text-[16px]">
                                Create Account
                            </button>
                        </form>

                        <div className="animate-element animate-delay-700 relative flex items-center justify-center mt-4">
                            <span className="w-full border-t border-[#27272a]"></span>
                            <span className="px-5 text-[14px] text-[#a1a1aa] bg-black absolute">Or continue with</span>
                        </div>

                        <button onClick={onGithubSignUp} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#27272a] rounded-2xl py-[18px] hover:bg-[#121212] transition-colors text-white font-medium mt-2 text-[16px]">
                            <GithubIcon />
                            Continue with GitHub
                        </button>

                        <p className="animate-element animate-delay-900 text-center text-[15px] text-[#a1a1aa] mt-4">
                            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSignIn?.(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">Sign In</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image */}
            {heroImageSrc && (
                <section className="hidden md:block flex-1 relative p-4">
                    <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
                </section>
            )}
        </div>
    );
};
