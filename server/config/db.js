import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    console.log('[DB] Connecting to MongoDB Atlas...');

    const conn = await mongoose.connect(connStr);

    console.log(`[DB] MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};
