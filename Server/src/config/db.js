import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `✅ MongoDB Connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop the app if DB connection fails
  }
};

export default connectDB;