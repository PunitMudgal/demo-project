import User from "../models/User.js";
import connectToDB from "./ConnectDB.js";
import bcrypt from "bcrypt";
import { users } from "./data.js";
import { ErrorMessages } from "../common/messages.js";
import mongoose from "mongoose";
import env from "dotenv";
env.config();

const seedDatabase = async () => {
  try {
    await connectToDB();
    await User.deleteMany({});
    console.log("all users deleted successfully from the db");

    const salt = await bcrypt.genSalt(10);
    // const HashedPassword = await bcrypt.hash()

    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
          date_of_birth: new Date(user.date_of_birth),
        };
      })
    );
    console.log("user with hashed pass: ", usersWithHashedPasswords);
    await User.insertMany(usersWithHashedPasswords);
    console.log("seed successful!");
  } catch (error) {
    console.log(ErrorMessages.SEED_ERROR, error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
