import mongoose from "mongoose";

import env from "../src/config/env.js";
import User from "../src/models/User.js";

const testUserModel = async () => {
  try {
    await mongoose.connect(env.mongodbUri);

    console.log("MongoDB connected.");

    const user = new User({
      firstName: "Test",
      lastName: "Athlete",
      username: `testathlete${Date.now()}`,
      email: `test${Date.now()}@sportlinked.com`,
      password: "Football@123",
      role: "ATHLETE",
    });

    await user.validate();

    console.log("");
    console.log("====================================");
    console.log("USER MODEL TEST PASSED");
    console.log("====================================");
    console.log("Name:", user.firstName, user.lastName);
    console.log("Role:", user.role);
    console.log("Email:", user.email);
    console.log("Account Status:", user.accountStatus);
    console.log(
      "Identity Status:",
      user.identityVerification.status
    );
    console.log("====================================");
  } catch (error) {
    console.error("");
    console.error("USER MODEL TEST FAILED");
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
};

testUserModel();