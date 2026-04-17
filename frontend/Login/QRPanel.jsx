import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import api from '../src/api/api';
import { toast } from '../src/components/ui/Notification.jsx';

export const QRPanel = ({ onLoginSuccess }) => {
    const [qrToken, setQrToken] = useState('');
    const [qrState, setQrState] = useState('waiting');
    const [qrCountdown, setQrCountdown] = useState(60);
    const [serverIp, setServerIp] = useState('localhost');

    const pollRef = useRef(null);
    const expiryRef = useRef(null);
    const tickRef = useRef(null);

    const clearQrTimers = useCallback(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (expiryRef.current) clearTimeout(expiryRef.current);
        if (tickRef.current) clearInterval(tickRef.current);
    }, []);

    const startQrSession = useCallback(async () => {
        clearQrTimers();

        try {
            // Ask the backend for the laptop's real networking IP
            const configRes = await api.get('/auth/qr/config');
            const { ip } = configRes.data.data;
            setServerIp(ip || window.location.hostname);

            const response = await api.post('/auth/qr/generate');
            const { token } = response.data.data;

            setQrToken(token);
            setQrState('waiting');
            setQrCountdown(60);

            // 1. Countdown tick
            tickRef.current = setInterval(() => {
                setQrCountdown((prev) => {
                    if (prev <= 1) { clearInterval(tickRef.current); return 0; }
                    return prev - 1;
                });
            }, 1000);

            // 2. Real Polling logic
            pollRef.current = setInterval(async () => {
                try {
                    const statusRes = await api.get(`/auth/qr/status/${token}`);
                    const { status, token: jwt, user } = statusRes.data.data;

                    if (status === 'verified' && jwt) {
                        setQrState('success');
                        clearQrTimers();

                        // Store the data similar to manual login
                        localStorage.setItem('token', jwt);
                        localStorage.setItem('username', user.username);

                        toast('QR Login Successful!', 'success');

                        // trigger success callback after a short delay to show success UI
                        setTimeout(() => onLoginSuccess(), 1500);
                    }
                } catch (err) {
                    // If session not found or expired on backend
                    setQrState('expired');
                    clearQrTimers();
                }
            }, 3000);

            // 3. Frontend safety expiry after 60s
            expiryRef.current = setTimeout(() => {
                setQrState('expired');
                clearQrTimers();
            }, 60000);

        } catch (error) {
            toast('Failed to initialize QR session', 'error');
            setQrState('expired');
        }
    }, [clearQrTimers, onLoginSuccess]);

    useEffect(() => {
        startQrSession();
        return clearQrTimers;
    }, [startQrSession, clearQrTimers]);

    // Update the QR value to the verification URL using the local IP
    const qrValue = `http://${serverIp}:5173/qr-verify?token=${qrToken}`;

    return (
        <div className="absolute inset-4 rounded-3xl bg-[#0a0a0a] border border-[#27272a] flex flex-col items-center justify-center gap-6">
            {/* QR Waiting State */}
            {qrState === 'waiting' && (
                <>
                    {/* Security Tip */}
                    <div className="absolute top-6 px-4 py-1.5 bg-[#a78bfa]/10 border border-[#a78bfa]/20 rounded-full">
                        <p className="text-[10px] text-[#a78bfa] font-medium tracking-wide uppercase">Secure Local Connection</p>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[#a78bfa]/20 via-[#7c3aed]/10 to-[#c4b5fd]/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white p-5 rounded-2xl shadow-2xl">
                            {qrToken ? (
                                <QRCodeSVG
                                    value={qrValue}
                                    size={200}
                                    level="H"
                                    bgColor="#ffffff"
                                    fgColor="#0f0f0f"
                                />
                            ) : (
                                <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                                    <div className="w-8 h-8 border-4 border-[#a78bfa]/30 border-t-[#a78bfa] rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-52 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-linear"
                            style={{
                                width: `${(qrCountdown / 60) * 100}%`,
                                background: qrCountdown > 15 ? 'linear-gradient(90deg, #a78bfa, #7c3aed)' : 'linear-gradient(90deg, #ef4444, #f97316)',
                            }}
                        />
                    </div>
                    {/* Scanning indicator */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a78bfa] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a78bfa]" />
                            </div>
                            <p className="text-sm text-[#a1a1aa]">Waiting for scan… <span className="text-[#52525b] font-mono">{qrCountdown}s</span></p>
                        </div>
                        {serverIp !== 'localhost' && (
                            <p className="text-[11px] text-[#3f3f46] font-mono">Host IP: {serverIp}</p>
                        )}
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
    );
};
