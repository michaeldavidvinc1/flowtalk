import {z, ZodType} from "zod";
import {TypeMessage} from "@prisma/client";

export class MessageValidation {
    static readonly SEND_MESSAGE: ZodType = z.object({
        conversationId: z.string().min(1),
        senderId: z.string().email().min(1),
        content: z.string().min(1),
        type: z.string().min(1),
        replyTo: z.string(),
    });
}