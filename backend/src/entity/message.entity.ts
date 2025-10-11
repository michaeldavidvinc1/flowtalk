import moment from "moment-timezone";
import {Message, TypeMessage} from "@prisma/client";

export class MessageEntity {
    constructor(
        public id: string,
        public conversationId: string,
        public senderId: string,
        public content: string | null,
        public type: TypeMessage,
        public replyTo: string | null,
        public createdAt: Date,
    ) {}

    private formatDate(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    static fromPrisma(message: Message): MessageEntity {
        return new MessageEntity(
            message.id,
            message.conversationId,
            message.senderId,
            message.content,
            message.type,
            message.replyTo,
            message.createdAt,
        );
    }

    toResponse() {
        return {
            id: this.id,
            conversationId: this.conversationId,
            senderId: this.senderId,
            content: this.content,
            type: this.type,
            replyTo: this.replyTo,
            createdAt: this.formatDate(this.createdAt),
        };
    }
}
