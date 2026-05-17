import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env or Render environment variables.');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log('MongoDB connected');
}
