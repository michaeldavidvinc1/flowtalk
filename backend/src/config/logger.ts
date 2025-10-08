import winston from "winston";
import config from "./config";

const enumerateErrorFormat = winston.format((info: winston.Logform.TransformableInfo) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

// 🧠 Custom format: ada timestamp + warna level + pesan
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: config.env === "development" ? "debug" : "info",
    format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // ✅ Tambah waktu
        config.env === "development"
            ? winston.format.colorize({ all: true }) // warna di dev
            : winston.format.uncolorize(),            // plain di prod
        winston.format.splat(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ["error"],
        }),
        new winston.transports.File({
            filename: "logs/combined.log",
            level: "info",
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});
