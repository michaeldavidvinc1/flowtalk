import moment from "moment-timezone";
import {MessageStatus, StatusMessage} from "@prisma/client";

export class MessageStatusEntity {
    constructor(
        public id: string,
        public messageId: string,
        public userId: string,
        public status: StatusMessage,
    ) {}

    private formatDate(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    static fromPrisma(messageStatus: MessageStatus): MessageStatusEntity {
        return new MessageStatusEntity(
            messageStatus.id,
            messageStatus.messageId,
            messageStatus.userId,
            messageStatus.status,
        );
    }

    toResponse() {
        return {
            id: this.id,
            messageId: this.messageId,
            userId: this.userId,
            status: this.status,
        };
    }
}
