import { Request, Response, NextFunction } from 'express';
import {logger} from "../config/logger";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync =
    (fn: AsyncFunction) =>
        (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
                if (err instanceof Error) {
                    logger.error("Unhandled error in %s %s: %s", req.method, req.originalUrl, err.stack || err.message);
                    next(err);
                } else {
                    logger.error("Unhandled non-Error exception in %s %s: %o", req.method, req.originalUrl, err);
                    next(new Error("An unknown error occurred"));
                }
            });
        };

export default catchAsync;