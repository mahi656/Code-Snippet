import mongoose from 'mongoose';

class Database {
    public async connect(): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URL as string);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }
}

export default new Database();
