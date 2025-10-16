import {IConversationMemberCreate} from "../../../interface/conversation.member.interface";
import {ConversationMemberEntity} from "../../../entity/conversation.member.entity";

export interface ConversationMemberRepositoryImpl {
    createConversationMember(conversationMemberData: IConversationMemberCreate): Promise<ConversationMemberEntity>;
}