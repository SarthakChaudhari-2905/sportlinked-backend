import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import certificateRoutes from "./routes/certificate.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import athleteProfileRoutes from "./routes/athleteProfile.routes.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import verificationRoutes from "./routes/verification.routes.js";
import athleteVideoRoutes from "./routes/athleteVideo.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import eventRoutes from "./routes/event.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import messageRoutes from "./routes/message.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// SECURITY
// ==========================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// ==========================================
// RATE LIMITING
// ==========================================

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use(globalRateLimiter);

// ==========================================
// REQUEST PARSING
// ==========================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

// ==========================================
// STATIC FILES (uploaded avatars, certificates, videos, banners)
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// ==========================================
// LOGGING
// ==========================================

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SportLinked API is running",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// API ROOT
// ==========================================

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SportLinked API",
    version: "v1",
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
  "/api/v1/auth",
  authRoutes
);
app.use(
  "/api/v1/users",
  userRoutes
);
app.use(
  "/api/v1/certificates",
  certificateRoutes
);
app.use(
  "/api/v1/organizations",
  organizationRoutes
);
app.use(
  "/api/v1/connections",
  connectionRoutes
);

app.use(
  "/api/v1/messages",
  messageRoutes
);
app.use(
  "/api/v1/achievements",
  achievementRoutes
);
app.use(
  "/api/v1/athlete-videos",
  athleteVideoRoutes
);
app.use(
  "/api/v1/athletes",
  athleteProfileRoutes
);
app.use(
  "/api/v1/applications",
  applicationRoutes
);
app.use(
  "/api/v1/events",
  eventRoutes
);
app.use(
  "/api/v1/verifications",
  verificationRoutes
);
app.use(
  "/api/v1/uploads",
  uploadRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(notFoundMiddleware);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorMiddleware);

export default app;

