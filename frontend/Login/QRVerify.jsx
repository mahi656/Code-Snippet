import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../src/api/api';
import { toast } from '../src/components/ui/Notification.jsx';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export const QRVerify = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('checking'); // checking, ready, loading, success, error
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            toast('Please log in on this device first', 'error');
            // Redirect to login but remember where we wanted to go
            navigate(`/login?redirect=qr-verify&token=${token}`);
            return;
        }

        if (!token) {
            setStatus('error');
            return;
        }

        setStatus('ready');
    }, [token, navigate]);

    const handleAuthorize = async () => {
        setStatus('loading');

        try {
            await api.post('/auth/qr/verify', { token });

            setStatus('success');
            toast('Login Authorized!', 'success');

            // Redirect to dashboard after 2s
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification failed';
            toast(msg, 'error');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-geist">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-[#09090b] border border-[#27272a] rounded-3xl p-8 text-center space-y-6 shadow-2xl"
            >
                {status === 'checking' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 className="w-10 h-10 text-[#a78bfa] animate-spin" />
                        <p className="text-[#a1a1aa]">Verifying session…</p>
                    </div>
                )}

                {status === 'ready' && (
                    <>
                        <div className="w-16 h-16 bg-[#a78bfa]/10 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-8 h-8 text-[#a78bfa]" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-white tracking-tight">Authorize Login</h2>
                            <p className="text-[#a1a1aa] text-sm leading-relaxed">
                                Are you trying to log in to another device? Only authorize if you recognize the request.
                            </p>
                        </div>
                        <button
                            onClick={handleAuthorize}
                            className="w-full bg-[#a78bfa] hover:bg-[#c4b5fd] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-[#a78bfa]/20 active:scale-[0.98]"
                        >
                            Authorize Device
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full text-[#52525b] hover:text-[#a1a1aa] text-sm font-medium transition-colors"
                        >
                            No, it wasn't me
                        </button>
                    </>
                )}

                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 className="w-10 h-10 text-[#a78bfa] animate-spin" />
                        <p className="text-[#a1a1aa]">Sending authorization…</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Device Authorized!</h2>
                        <p className="text-[#a1a1aa] text-sm">You can now close this tab.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Invalid Session</h2>
                        <p className="text-[#a1a1aa] text-sm">The QR code is invalid or has expired.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-[#27272a] text-white rounded-xl text-sm"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QRVerify;
