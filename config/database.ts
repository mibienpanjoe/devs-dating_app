import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/devstinder';
    await mongoose.connect(mongoURI);
    console.log("Mongo connected successfully");
  } catch (error) {
    console.error("Mongo connection error:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;