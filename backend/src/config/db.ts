import mongoose from 'mongoose';

class Database {
    private readonly reconnectDelayMs = 10000;

    public async connect(): Promise<void> {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            console.error('MONGO_URL is not defined. Skipping MongoDB connection.');
            return;
        }

        try {
            await mongoose.connect(mongoUrl);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            console.log(`Retrying MongoDB connection in ${this.reconnectDelayMs / 1000}s...`);
            setTimeout(() => {
                void this.connect();
            }, this.reconnectDelayMs);
        }
    }
}

export default new Database();
