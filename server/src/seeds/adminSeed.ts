import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db";
import User from "../models/User";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@yumi.com";
    const adminPassword = "adminpassword123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists. Updating to ensure isAdmin is true.");
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log("Admin user updated successfully.");
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      // Create admin user
      const adminUser = new User({
        firstname: "System",
        lastname: "Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save();
      console.log("Sample Admin user created successfully.");
    }

    console.log("--------------------------------root");
    console.log("Admin Credentials:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("--------------------------------");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
