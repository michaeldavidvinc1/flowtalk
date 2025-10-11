import {StatusCalls, TypeCalls} from "@prisma/client";

export interface ICall {
    id: string;
    conversationId: string;
    callerId: string;
    type: TypeCalls;
    status: StatusCalls;
    startAt: Date;
    endedAt: Date;
}