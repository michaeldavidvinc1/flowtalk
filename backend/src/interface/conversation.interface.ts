import {TypeConversation} from "@prisma/client";

export interface IConversation {
    id: string;
    type: TypeConversation;
    name: string;
    avatarUrl: string;
    createdBy: string;
    createdAt: Date;
}