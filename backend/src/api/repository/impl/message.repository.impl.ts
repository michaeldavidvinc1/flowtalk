import {IMessageCreate} from "../../../interface/message.interface";
import {MessageEntity} from "../../../entity/message.entity";

export interface MessageRepositoryImpl {
    createMessage(messageData: IMessageCreate): Promise<MessageEntity>;
}