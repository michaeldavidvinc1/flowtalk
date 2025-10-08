import cookieParser from "cookie-parser";
import express, { NextFunction, Request } from "express";
import cors from "cors";
import { errorConverter, errorHandler } from "./middleware/error";
import helmet from "helmet";
import {endpoint} from "./api/routes";
import {Server} from "socket.io"
import * as http from "node:http";
import {logger} from "./config/logger";


const app = express();
const server = http.createServer(app);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse cookie
app.use(cookieParser());

// enable cors
app.use(cors({ credentials: true }));
app.options("*", cors());
app.use(helmet())

// Server socket io
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    logger.info(`Connected to socket io => ${socket.id}`);

    socket.on("disconnect", () => {
        logger.info(`Disconnect to socket io => ${socket.id}`);
    });
});

// Inject io ke router supaya bisa broadcast dari controller
app.set("io", io);

app.use("/api/v1", endpoint)

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app