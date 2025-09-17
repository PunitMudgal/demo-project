import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("DATABASE CONNECTED!");
  } catch (error) {
    console.log("probem while connecting to the database! ", error);
  }
};
export default connectToDB;
