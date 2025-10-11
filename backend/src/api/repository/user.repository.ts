import {IUser, IUserCreate, IUserSearch, IUserUpdate} from "../../interface/user.interface";
import {prismaClient} from "../../config/db";
import {Pageable} from "../../interface/page";
import {UserRepositoryImpl} from "./impl/user.repository.impl";
import {logger} from "../../config/logger";
import {UserEntity} from "../../entity/user.entity";

export class UserRepository implements  UserRepositoryImpl {
    async createUser(userData: IUserCreate): Promise<UserEntity> {
        logger.info(`[UserRepository] Create user Start`);
        const user = await prismaClient.user.create({data: userData});
        logger.info(`[UserRepository] Create user End`);
        return UserEntity.fromPrisma(user);
    }
    async getUserById(id: string): Promise<UserEntity | null> {
        logger.info(`[UserRepository] Get User By Id Start`);
        const user = await prismaClient.user.findFirst({where: {id}})
        logger.info(`[UserRepository] Get User By Id End`);
        if (!user) return null;
        return UserEntity.fromPrisma(user);
    }
    async getUserByEmail(email: string): Promise<UserEntity | null> {
        logger.info(`[UserRepository] Get User By Email Start`);
        const user = await prismaClient.user.findFirst({where: {email}});
        logger.info(`[UserRepository] Get User By Email End`);
        if (!user) return null;
        return UserEntity.fromPrisma(user);
    }
    async updateUser(id: string, userData: IUserUpdate): Promise<UserEntity> {
        logger.info(`[UserRepository] Update User Start`);
        const user = await  prismaClient.user.update({where: {id}, data: userData});
        logger.info(`[UserRepository] Update User End`);
        return UserEntity.fromPrisma(user);
    }
    async deleteUser(id: string): Promise<UserEntity> {
        logger.info(`[UserRepository] Delete User Start`);
        const user = await prismaClient.user.delete({where: {id}});
        logger.info(`[UserRepository] Delete User End`);
        return UserEntity.fromPrisma(user);
    }
    async getAllUsers(userFilter: IUserSearch): Promise<Pageable<UserEntity>> {
        logger.info(`[UserRepository] Get All User Start`);
        const skip = (userFilter.page - 1) * userFilter.size;
        const filters: Record<string, unknown> = {};

        if (userFilter.name) {
            filters.name = {contains: userFilter.name};
        }
        if (userFilter.email) {
            filters.email = {contains: userFilter.email};
        }

        const user = await prismaClient.user.findMany({
            where: {...filters},
            take: userFilter.size,
            skip,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prismaClient.user.count({
            where: {...filters},
        });
        logger.info(`[UserRepository] Get All User End`);
        const entities = user.map((u) => UserEntity.fromPrisma(u));
        return {
            data: entities,
            paging: {
                current_page: userFilter.page,
                total_page: Math.ceil(total / userFilter.size),
                size: userFilter.size,
            },
        };
    }
}