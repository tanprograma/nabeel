import mongoose from 'mongoose';

export async function connectDB(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log(uri);
    console.log('MongoDB already connected');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri);
    const { host, port, name } = mongoose.connection;
    console.log(`MongoDB connected to ${host}:${port}/${name}`);

    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  } catch (error) {
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}

export default connectDB;
