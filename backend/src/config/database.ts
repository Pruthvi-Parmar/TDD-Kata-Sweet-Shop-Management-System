import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri);
};

const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};

export { connectDB, disconnectDB };

