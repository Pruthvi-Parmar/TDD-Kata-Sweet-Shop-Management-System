import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri);
  
  try {
    const usersCollection = mongoose.connection.collection('users');
    const indexes = await usersCollection.indexes();
    const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
    if (hasUsernameIndex) {
      await usersCollection.dropIndex('username_1');
    }
  } catch {
  }
};

const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};

export { connectDB, disconnectDB };

