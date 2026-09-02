import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";

config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// health check
app.get('/health', (req, res) => {
    res.json({ status: "OK" });
});



app.use("/", (req, res) => {
    res.json({ message: "Welcome to Store Rating Platform" });
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

process.on("unhandledRejection", (err, promise) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}); 
