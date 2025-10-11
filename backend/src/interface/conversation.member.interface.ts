import {RoleConversation} from "@prisma/client";

export interface IConversationMember {
    id: string;
    conversationId: string;
    userId: string;
    role: RoleConversation;
    joinAt: Date;
}