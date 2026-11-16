
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");
const User = require("./models/User");

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

async function createAdmin() {
  try {
    const name = await rl.question("Admin Name: ");
    const email = (await rl.question("Admin Email: "))
      .trim()
      .toLowerCase();
    const password = await rl.question("Admin Password: ");

    if (!name.trim() || !email || !password) {
      throw new Error("All fields are required.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error("MONGODB_URI or JWT_SECRET is missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already exists. Please use another email."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("\nAdmin account created successfully!");
    console.log("Admin Email:", admin.email);
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("\nError:", error.message);
  } finally {
    rl.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createAdmin();
