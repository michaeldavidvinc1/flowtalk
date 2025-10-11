import moment from "moment-timezone";
import {ConversationMember, RoleConversation} from "@prisma/client";

export class ConversationMemberEntity {
    constructor(
        public id: string,
        public conversationId: string,
        public userId: string,
        public role: RoleConversation,
        public joinAt: Date
    ) {}

    private formatDate(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    static fromPrisma(conversationMember: ConversationMember): ConversationMemberEntity {
        return new ConversationMemberEntity(
            conversationMember.id,
            conversationMember.conversationId,
            conversationMember.userId,
            conversationMember.role,
            conversationMember.joinAt
        );
    }

    toResponse() {
        return {
            id: this.id,
            conversationId: this.conversationId,
            userId: this.userId,
            role: this.role,
            joinAt: this.formatDate(this.joinAt),
        };
    }
}
