import React, { useState, useEffect } from "react";
import TetrisLoading from "@/components/ui/tetris-loader";
import { SignInPage } from "@/components/ui/sign-in-flow-1";

export default function FrontAnimate() {
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLogin(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full h-full min-h-screen bg-black overflow-hidden">
            {/* Tetris Animation - hidden after 5s */}
            <div
                className={`absolute inset-0 z-10 transition-opacity duration-1000 ${showLogin ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
            >
                <TetrisLoading size="md" speed="normal" />
            </div>

            {/* SignInPage - always mounted to allow background initialization, visible after 5s */}
            <div
                className={`absolute inset-0 z-0 transition-opacity duration-1000 ${showLogin ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <SignInPage />
            </div>
        </div>
    );
}
