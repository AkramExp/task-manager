import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch(() => {
      console.log("Error connecting Database");
    });
};

export default connectDB;
