import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

export const QRPanel = ({ onLoginSuccess }) => {
    const [qrToken, setQrToken] = useState(uuidv4());
    const [qrState, setQrState] = useState('waiting');
    const [qrCountdown, setQrCountdown] = useState(18);

    const pollRef = useRef(null);
    const expiryRef = useRef(null);
    const tickRef = useRef(null);

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
            setQrCountdown((prev) => {
                if (prev <= 1) { clearInterval(tickRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);

        // mock: auto-login after 7s
        pollRef.current = setTimeout(() => {
            setQrState('success');
            clearQrTimers();
            // trigger success callback
            setTimeout(() => onLoginSuccess(), 1500);
        }, 7000);

        // expire after 18s
        expiryRef.current = setTimeout(() => {
            clearTimeout(pollRef.current);
            clearInterval(tickRef.current);
            setQrState('expired');
            setQrCountdown(0);
        }, 18000);
    }, [clearQrTimers, onLoginSuccess]);

    useEffect(() => {
        startQrSession();
        return clearQrTimers;
    }, [startQrSession, clearQrTimers]);

    return (
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
    );
};
