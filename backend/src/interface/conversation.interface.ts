import {TypeConversation} from "@prisma/client";

export interface IConversation {
    id: string;
    type: TypeConversation;
    name: string;
    avatarUrl: string;
    createdBy: string;
    createdAt: Date;
}

export interface IConversationCreate {
    type: TypeConversation;
    name: string;
    avatarUrl: string;
    createdBy: string;
}
