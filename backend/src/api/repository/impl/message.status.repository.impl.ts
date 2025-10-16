import {IMessageStatusCreate} from "../../../interface/message.status.interface";
import {MessageStatusEntity} from "../../../entity/message.status.entity";

export interface MessageStatusRepositoryImpl {
    createMessageStatus(messageStatuData: IMessageStatusCreate): Promise<MessageStatusEntity>;
}