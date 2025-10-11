import {StatusMessage} from "@prisma/client";

export interface IMessageStatus {
    id: string;
    messageId: string;
    userId: string;
    status: StatusMessage;
}