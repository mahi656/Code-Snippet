import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

class AuthController {
    public signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { fullName, username, email, password } = req.body;

        if (!fullName || !username || !email || !password) {
            throw new ApiError(400, 'Please provide all required fields');
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new ApiError(400, 'User with this email or username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: IUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json(new ApiResponse(201, null, 'User registered successfully'));
    });

    public login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, 'Please provide email and password');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, 'Invalid credentials');
        }

        if (!user.password) {
            throw new ApiError(400, 'This account uses OAuth. Please sign in with GitHub.');
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            throw new ApiError(400, 'Invalid credentials');
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });

        res.status(200).json(new ApiResponse(200, {
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            }
        }, 'Logged in successfully'));
    });

    public getUserByUsername = asyncHandler(async (req: any, res: Response): Promise<void> => {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
    });
}

export default new AuthController();
