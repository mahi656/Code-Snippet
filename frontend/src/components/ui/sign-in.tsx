import React, { useState } from 'react';
import { Eye, EyeOff, Github } from 'lucide-react';

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
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border border-[#27272a] bg-[#121212] transition-colors focus-within:border-white focus-within:bg-[#18181b]">
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
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-black">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <h1 className="animate-element animate-delay-100 text-5xl font-normal leading-tight text-white mb-2">{title}</h1>
                        <p className="animate-element animate-delay-200 text-[#a1a1aa] text-[15px]">{description}</p>

                        <form className="space-y-6 mt-4" onSubmit={onSignIn}>
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
                                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-[18px] pr-12 rounded-xl focus:outline-none text-white placeholder:text-[#52525b]" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center">
                                            {showPassword ? <EyeOff strokeWidth={1.5} className="w-5 h-5 text-[#52525b] hover:text-white transition-colors" /> : <Eye strokeWidth={1.5} className="w-5 h-5 text-[#52525b] hover:text-white transition-colors" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-[18px] h-[18px] rounded-full border border-[#3f3f46] flex items-center justify-center group-hover:border-[#71717a] transition-colors">
                                        <input type="checkbox" name="rememberMe" className="opacity-0 absolute w-0 h-0" />
                                    </div>
                                    <span className="text-[#f4f4f5] text-[15px]">Keep me signed in</span>
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] text-[15px] transition-colors">Reset password</a>
                            </div>

                            <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-[#e5e5e5] hover:bg-white py-[18px] font-medium text-black transition-colors mt-6 text-[16px]">
                                Sign In
                            </button>
                        </form>

                        <div className="animate-element animate-delay-700 relative flex items-center justify-center mt-4">
                            <span className="w-full border-t border-[#27272a]"></span>
                            <span className="px-5 text-[14px] text-[#a1a1aa] bg-black absolute">Or continue with</span>
                        </div>

                        <button onClick={onGithubSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#27272a] rounded-2xl py-[18px] hover:bg-[#121212] transition-colors text-white font-medium mt-2 text-[16px]">
                            <GithubIcon />
                            Continue with GitHub
                        </button>

                        <p className="animate-element animate-delay-900 text-center text-[15px] text-[#a1a1aa] mt-4">
                            New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">Create Account</a>
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
