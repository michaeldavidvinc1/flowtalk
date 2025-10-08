import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prismaClient = new PrismaClient({
  errorFormat: "pretty",
  log: [
    { level: "info", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "error", emit: "event" },
  ],
});

prismaClient.$on("info", (e: { timestamp: Date; message: string }) => {
  logger.info(e.message);
});

prismaClient.$on("warn", (e: { timestamp: Date; message: string }) => {
  logger.warn(e.message);
});

prismaClient.$on("error", (e: { timestamp: Date; message: string }) => {
  logger.error(e.message);
});
