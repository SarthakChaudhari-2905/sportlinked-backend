import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongodbUri: process.env.MONGODB_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,

    accessExpiresIn:
      process.env.JWT_ACCESS_EXPIRES_IN || "15m",

    refreshExpiresIn:
      process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  bcryptSaltRounds:
    Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  maxFileSizeMb:
    Number(process.env.MAX_FILE_SIZE_MB) || 50,
};

export default env;