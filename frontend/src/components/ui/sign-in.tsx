import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, EyeOff, Github, QrCode, Mail, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

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
    const [loginMode, setLoginMode] = useState<'qr' | 'email'>('qr');

    // --- QR Login State ---
    const [qrToken, setQrToken] = useState(uuidv4());
    const [qrState, setQrState] = useState<'waiting' | 'success' | 'expired'>('waiting');
    const [qrCountdown, setQrCountdown] = useState(18);
    const pollRef = useRef<any>(null);
    const expiryRef = useRef<any>(null);
    const tickRef = useRef<any>(null);

    const clearQrTimers = useCallback(() => {
        if (pollRef.current) clearTimeout(pollRef.current);
        if (expiryRef.current) clearTimeout(expiryRef.current);
        if (tickRef.current) clearInterval(tickRef.current);
    }, []);

    const startQrSession = useCallback(() => {
        clearQrTimers();
        const newToken = uuidv4();
        setQrToken(newToken);
        setQrState('waiting');
        setQrCountdown(18);

        // countdown tick
        tickRef.current = setInterval(() => {
            setQrCountdown(prev => {
                if (prev <= 1) { clearInterval(tickRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);

        // mock: auto-login after 7s
        pollRef.current = setTimeout(() => {
            setQrState('success');
            clearQrTimers();
            // redirect after showing success
            setTimeout(() => onSignIn?.({} as any), 1500);
        }, 7000);

        // expire after 18s
        expiryRef.current = setTimeout(() => {
            clearTimeout(pollRef.current);
            clearInterval(tickRef.current);
            setQrState('expired');
            setQrCountdown(0);
        }, 18000);
    }, [clearQrTimers, onSignIn]);

    useEffect(() => {
        if (loginMode === 'qr') startQrSession();
        return clearQrTimers;
    }, [loginMode]);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] bg-black">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <h1 className="animate-element animate-delay-100 text-5xl font-normal leading-tight text-white mb-2">{title}</h1>
                        <p className="animate-element animate-delay-200 text-[#a1a1aa] text-[15px]">{description}</p>

                        {/* Login Mode Tabs */}
                        <div className="animate-element animate-delay-200 flex rounded-xl bg-[#121212] border border-[#27272a] p-1">
                            <button
                                type="button"
                                onClick={() => setLoginMode('qr')}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer ${
                                    loginMode === 'qr' ? 'bg-[#27272a] text-white' : 'text-[#52525b] hover:text-[#a1a1aa]'
                                }`}
                            >
                                <QrCode className="w-4 h-4" />
                                QR Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMode('email')}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer ${
                                    loginMode === 'email' ? 'bg-[#27272a] text-white' : 'text-[#52525b] hover:text-[#a1a1aa]'
                                }`}
                            >
                                <Mail className="w-4 h-4" />
                                Email Login
                            </button>
                        </div>

                        {/* QR Login Mode - left side message */}
                        {loginMode === 'qr' && (
                            <div className="mt-4 space-y-5">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-[#a78bfa]" />
                                    <p className="text-[15px] text-[#e4e4e7]">Scan this QR code using your mobile to login</p>
                                </div>
                                <div className="space-y-3 text-[14px] text-[#a1a1aa]">
                                    <p>1. Open the <span className="text-white">Code Snippet</span> app on your phone</p>
                                    <p>2. Go to <span className="text-white">Settings → Scan QR</span></p>
                                    <p>3. Point your camera at the QR code</p>
                                </div>

                                <div className="relative flex items-center justify-center mt-4">
                                    <span className="w-full border-t border-[#27272a]"></span>
                                    <span className="px-5 text-[14px] text-[#a1a1aa] bg-black absolute">Or continue with</span>
                                </div>

                                <button onClick={onGithubSignIn} className="w-full flex items-center justify-center gap-3 border border-[#27272a] rounded-2xl py-[18px] hover:bg-[#121212] transition-colors text-white font-medium mt-2 text-[16px]">
                                    <GithubIcon />
                                    Continue with GitHub
                                </button>

                                <p className="text-center text-[15px] text-[#a1a1aa] mt-4">
                                    New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">Create Account</a>
                                </p>
                            </div>
                        )}

                        {/* Email Login Mode - original form */}
                        {loginMode === 'email' && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Right column: hero image OR QR code */}
            <section className="hidden md:block flex-1 relative p-4">
                {loginMode === 'email' && heroImageSrc ? (
                    <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
                ) : loginMode === 'qr' ? (
                    <div className="absolute inset-4 rounded-3xl bg-[#0a0a0a] border border-[#27272a] flex flex-col items-center justify-center gap-6">
                        {/* QR Waiting State */}
                        {qrState === 'waiting' && (
                            <>
                                <div className="relative group">
                                    <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[#a78bfa]/20 via-[#7c3aed]/10 to-[#c4b5fd]/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white p-5 rounded-2xl shadow-2xl">
                                        <QRCodeSVG
                                            value={`${window.location.origin}/qr-login?token=${qrToken}`}
                                            size={200}
                                            level="H"
                                            bgColor="#ffffff"
                                            fgColor="#0f0f0f"
                                        />
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="w-52 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-linear"
                                        style={{
                                            width: `${(qrCountdown / 18) * 100}%`,
                                            background: qrCountdown > 5 ? 'linear-gradient(90deg, #a78bfa, #7c3aed)' : 'linear-gradient(90deg, #ef4444, #f97316)',
                                        }}
                                    />
                                </div>
                                {/* Scanning indicator */}
                                <div className="flex items-center gap-2.5">
                                    <div className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a78bfa] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a78bfa]" />
                                    </div>
                                    <p className="text-sm text-[#a1a1aa]">Waiting for scan… <span className="text-[#52525b] font-mono">{qrCountdown}s</span></p>
                                </div>
                            </>
                        )}

                        {/* QR Success State */}
                        {qrState === 'success' && (
                            <div className="flex flex-col items-center gap-5">
                                <div className="relative">
                                    <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-medium text-emerald-400">Login Successful!</h3>
                                <p className="text-sm text-[#a1a1aa]">Redirecting to dashboard…</p>
                                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                            </div>
                        )}

                        {/* QR Expired State */}
                        {qrState === 'expired' && (
                            <div className="flex flex-col items-center gap-5">
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-400/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                </div>
                                <h3 className="text-xl font-medium text-orange-400">QR Code Expired</h3>
                                <p className="text-sm text-[#a1a1aa]">This code is no longer valid.</p>
                                <button
                                    onClick={startQrSession}
                                    className="rounded-2xl bg-[#e5e5e5] hover:bg-white py-3 px-8 font-medium text-black transition-colors text-[15px] cursor-pointer"
                                >
                                    ↻ Regenerate QR Code
                                </button>
                            </div>
                        )}
                    </div>
                ) : null}
            </section>
        </div>
    );
};
