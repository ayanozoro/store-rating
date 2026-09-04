import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoute.js";
import ratingRoutes from "./routes/ratingRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import ownerRoutes from "./routes/ownerRoute.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: "OK" });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Store Rating Platform" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    process.exit(1);
});
