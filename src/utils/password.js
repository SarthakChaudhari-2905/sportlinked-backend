import bcrypt from "bcryptjs";
import env from "../config/env.js";

const hashPassword = async (password) => {
  return bcrypt.hash(
    password,
    env.bcryptSaltRounds
  );
};

const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};

export {
  hashPassword,
  comparePassword,
};