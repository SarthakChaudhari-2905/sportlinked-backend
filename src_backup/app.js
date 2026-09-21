import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import reelRoutes from "./routes/reels.js";
import tournamentRoutes from "./routes/tournaments.js";
import notificationRoutes from "./routes/notifications.js";
import uploadRoutes from "./routes/uploads.js";
import searchRoutes from "./routes/search.js";
import userRoutes from "./routes/users.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;

