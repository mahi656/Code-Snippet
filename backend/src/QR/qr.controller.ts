import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as os from 'os';
import QRSession from './qr.model';
import User, { IUser } from '../Auth/auth.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { generateToken } from '../Auth/token.util';

class QRController {
    // Detect local network IP for cross-device access
    public getConfig = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const interfaces = os.networkInterfaces();
        let localIp = 'localhost';

        for (const devName in interfaces) {
            const iface = interfaces[devName];
            if (!iface) continue;

            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    localIp = alias.address;
                    break;
                }
            }
            if (localIp !== 'localhost') break;
        }

        res.status(200).json(new ApiResponse(200, { ip: localIp, port: process.env.PORT || 5001 }, 'Config fetched'));
    });

    // 1. Generate a new QR token (Public)
    public generate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 4 * 60 * 1000); //minutes expiry

        const session = await QRSession.create({
            token,
            status: 'pending',
            expiresAt
        });

        res.status(201).json(new ApiResponse(201, { token: session.token }, 'QR session generated'));
    });

    // 2. Check QR session status (Public - Polling)
    public checkStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { token } = req.params;
        const session = await QRSession.findOne({ token }).populate('userId');

        if (!session) {
            throw new ApiError(404, 'Session not found or expired');
        }

        if (session.status === 'verified' && session.userId) {
            const user = session.userId as unknown as IUser;
            const jwt = generateToken(user._id);

            // Clean up session after successful login
            await QRSession.deleteOne({ _id: session._id });

            res.status(200).json(new ApiResponse(200, {
                status: 'verified',
                token: jwt,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email
                }
            }, 'QR Login successful'));
            return;
        }

        res.status(200).json(new ApiResponse(200, { status: session.status }, 'Session status fetched'));
    });

    // 3. Verify QR token (Private - Called by secondary/mobile browser)
    public verify = asyncHandler(async (req: any, res: Response): Promise<void> => {
        const { token } = req.body;
        const userId = req.user.id;

        const session = await QRSession.findOne({ token });

        if (!session) {
            throw new ApiError(404, 'QR Session not found or expired');
        }

        if (session.status !== 'pending') {
            throw new ApiError(400, `Session is already ${session.status}`);
        }

        session.status = 'verified';
        session.userId = userId;
        await session.save();

        res.status(200).json(new ApiResponse(200, null, 'QR session verified successfully'));
    });
}

export default new QRController();
