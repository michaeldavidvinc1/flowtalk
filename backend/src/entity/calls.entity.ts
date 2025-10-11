import {Calls, StatusCalls, TypeCalls} from "@prisma/client";
import moment from "moment-timezone";

export class CallsEntity {
    constructor(
        public id: string,
        public conversationId: string,
        public callerId: string,
        public type: TypeCalls,
        public status: StatusCalls,
        public startAt: Date,
        public endedAt: Date,
    ) {}

    private formatDate(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    static fromPrisma(calls: Calls): CallsEntity {
        return new CallsEntity(
            calls.id,
            calls.conversationId,
            calls.callerId,
            calls.type,
            calls.status,
            calls.startAt,
            calls.endedAt,
        );
    }

    toResponse() {
        return {
            id: this.id,
            conversationId: this.conversationId,
            callerId: this.callerId,
            type: this.type,
            status: this.status,
            startAt: this.formatDate(this.startAt),
            endedAt: this.formatDate(this.endedAt),
        };
    }
}
