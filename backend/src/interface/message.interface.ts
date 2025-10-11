import {TypeMessage} from "@prisma/client";

export interface IMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string | null;
    type: string;
    replyTo: string | null;
    createdAt: Date;
}

export interface IMessageCreate {
    conversationId: string;
    senderId: string;
    content: string | null;
    type: TypeMessage;
    replyTo: string | null;
}