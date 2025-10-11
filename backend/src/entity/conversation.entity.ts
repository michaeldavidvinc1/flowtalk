import moment from "moment-timezone";
import {Conversation, TypeConversation} from "@prisma/client";

export class ConversationEntity {
    constructor(
        public id: string,
        public type: TypeConversation,
        public name: string,
        public avatarUrl: string,
        public createdBy: string,
        public createdAt: Date,
    ) {}

    private formatDate(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    static fromPrisma(conversation: Conversation): ConversationEntity {
        return new ConversationEntity(
            conversation.id,
            conversation.type,
            conversation.name,
            conversation.avatarUrl,
            conversation.createdBy,
            conversation.createdAt,
        );
    }

    toResponse() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            avatarUrl: this.avatarUrl,
            createdBy: this.createdBy,
            createdAt: this.formatDate(this.createdAt),
        };
    }
}
