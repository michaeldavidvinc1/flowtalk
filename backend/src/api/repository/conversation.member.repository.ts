import {ConversationMemberRepositoryImpl} from "./impl/conversation.member.repository.impl";
import {IConversationMemberCreate} from "../../interface/conversation.member.interface";
import {ConversationMemberEntity} from "../../entity/conversation.member.entity";
import {logger} from "../../config/logger";
import {prismaClient} from "../../config/db";


export class ConversationMemberRepository implements ConversationMemberRepositoryImpl {
    async createConversationMember(conversationMemberData:IConversationMemberCreate): Promise<ConversationMemberEntity>{
        logger.info(`[MessageRepository] Create message Start`);
        const conversationMember = await prismaClient.conversationMember.create({data: conversationMemberData});
        logger.info(`[MessageRepository] Create message End`);
        return ConversationMemberEntity.fromPrisma(conversationMember);
    }
}