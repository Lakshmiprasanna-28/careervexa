// === server/server.js ===
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import fs from "fs";
import dns from "dns";
import jwt from "jsonwebtoken";

import { setSocketIOInstance } from "./utils/sendNotification.js";
import configureSocket from "./socket.js";
import { syncUserRoles } from "./utils/syncUserRoles.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.set("io", io);

// === Authenticate Socket Connections ===
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log("❌ No token provided in socket handshake.");
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid token in socket auth:", err.message);
    return next(new Error("Invalid token"));
  }
});

// === Boot Socket Server Logic ===
configureSocket(io);               // ✅ should be early
setSocketIOInstance(io);

// === File Path Setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// === Middleware ===
app.set("trust proxy", 1);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
import "./config/passport.js";

// === Routes ===
import authRoutes from "./routes/auth.js";
import authOAuthRoutes from "./routes/authOAuth.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/admin.js";
import notificationRoutes from "./routes/notification.js";
import uploadRoutes from "./routes/upload.js";

app.use("/api/auth", authRoutes);
app.use("/auth", authOAuthRoutes);
app.use("/api/user", userRoutes);               // ✅ user settings, profiles
app.use("/api/users", userRoutes);              // ✅ messaging routes also come from here
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);        // ✅ new messaging API endpoints
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);

// === Resume Handling ===
app.use("/uploads", express.static(uploadPath));
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(uploadPath, req.params.filename);
  fs.stat(filePath, (err) => {
    if (err) return res.status(404).send("❌ Resume not found.");
    res.download(filePath);
  });
});

// === Frontend for Production ===
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("✅ Backend is live"));
}

// === Connect MongoDB and Start Server ===
const connectMongo = (uri) => {
  mongoose
    .connect(uri)
    .then(async () => {
      console.log("✅ MongoDB connected");
      await syncUserRoles();
      httpServer.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
      });
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
};

// === Choose DB URI Based on Network ===
dns.lookup("google.com", (err) => {
  const uri = err ? process.env.LOCAL_MONGO_URI : process.env.MONGO_URI;
  connectMongo(uri);
});
