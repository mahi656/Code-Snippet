import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';

class AuthController {
    public async signup(req: Request, res: Response): Promise<void> {
        try {
            const { fullName, username, email, password } = req.body;

            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                res.status(400).json({ message: 'User with this email or username already exists' });
                return;
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

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error in signup:', error);
            res.status(500).json({ message: 'Server error during signup' });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ message: 'Invalid credentials' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password as string);
            if (!isMatch) {
                res.status(400).json({ message: 'Invalid credentials' });
                return;
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });

            res.status(200).json({
                message: 'Logged in successfully',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ message: 'Server error during login' });
        }
    }
}

export default new AuthController();
