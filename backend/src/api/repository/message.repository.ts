import {MessageRepositoryImpl} from "./impl/message.repository.impl";
import {IMessageCreate} from "../../interface/message.interface";
import {MessageEntity} from "../../entity/message.entity";
import {logger} from "../../config/logger";
import {prismaClient} from "../../config/db";

export class MessageRepository implements MessageRepositoryImpl {
    async createMessage(messageData: IMessageCreate): Promise<MessageEntity>{
        logger.info(`[MessageRepository] Create message Start`);
        const message = await prismaClient.message.create({data: messageData});
        logger.info(`[MessageRepository] Create message End`);
        return MessageEntity.fromPrisma(message);
    }
}