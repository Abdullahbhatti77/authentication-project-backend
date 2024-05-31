import mongoose from "mongoose";

const connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed");
  }
};

export { connection };
