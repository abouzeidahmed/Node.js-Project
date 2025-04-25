import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/foodapp';

const connectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    console.log('⚠️ Already connected to MongoDB');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected:', conn.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
