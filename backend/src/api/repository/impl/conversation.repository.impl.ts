import {IConversationCreate} from "../../../interface/conversation.interface";
import {ConversationEntity} from "../../../entity/conversation.entity";

export interface ConversationRepositoryImpl {
    createConversation(conversationData: IConversationCreate): Promise<ConversationEntity>;
}