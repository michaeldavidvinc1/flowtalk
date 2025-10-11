import {MessageRepository} from "../repository/message.repository";
import {IMessage, IMessageCreate} from "../../interface/message.interface";
import {logger} from "../../config/logger";
import {Validation} from "../../validation/validation";
import {MessageValidation} from "../../validation/message.validation";

export class MessageService {
    constructor(private messageRepository: MessageRepository) {
    }

    async sendMessage(messageData: IMessageCreate): Promise<IMessage> {
        logger.info(`[MessageService] Send Message Start`);

        const messageRequest = Validation.validate(MessageValidation.SEND_MESSAGE ,messageData);


    }
}