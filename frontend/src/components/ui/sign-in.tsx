import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

interface SignInPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGoogleSignIn?: () => void;
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
    onGoogleSignIn,
    onResetPassword,
    onCreateAccount,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-background dark:bg-black">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <h1 className="animate-element animate-delay-100 text-5xl font-normal leading-tight text-white mb-2">Welcome</h1>
                        <p className="animate-element animate-delay-200 text-[#a1a1aa] text-[15px]">Access your account and continue your journey with us</p>

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

                        <button onClick={onGoogleSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#27272a] rounded-2xl py-[18px] hover:bg-[#121212] transition-colors text-white font-medium mt-2 text-[16px]">
                            <GoogleIcon />
                            Continue with Google
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
