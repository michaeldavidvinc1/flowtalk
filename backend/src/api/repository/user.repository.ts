import {IUser, IUserCreate, IUserSearch, IUserUpdate} from "../../interface/userInterface";
import {prismaClient} from "../../config/db";
import {Pageable} from "../../interface/page";
import {UserRepositoryImpl} from "./impl/user.repository.impl";
import {logger} from "../../config/logger";

export class UserRepository implements  UserRepositoryImpl {
    async createUser(userData: IUserCreate): Promise<IUser> {
        logger.info(`[UserRepository] Create user Start`);
        const user = prismaClient.user.create({data: userData});
        logger.info(`[UserRepository] Create user End`);
        return user;
    }
    async getUserById(id: string): Promise<IUser | null> {
        logger.info(`[UserRepository] Get User By Id Start`);
        const user = prismaClient.user.findFirst({where: {id}})
        logger.info(`[UserRepository] Get User By Id End`);
        return user;
    }
    async getUserByEmail(email: string): Promise<IUser | null> {
        logger.info(`[UserRepository] Get User By Email Start`);
        const user = prismaClient.user.findFirst({where: {email}});
        logger.info(`[UserRepository] Get User By Email End`);
        return user;
    }
    async updateUser(id: string, userData: IUserUpdate): Promise<IUser> {
        logger.info(`[UserRepository] Update User Start`);
        const user =  prismaClient.user.update({where: {id}, data: userData});
        logger.info(`[UserRepository] Update User End`);
        return user;
    }
    async deleteUser(id: string): Promise<IUser> {
        logger.info(`[UserRepository] Delete User Start`);
        const user = prismaClient.user.delete({where: {id}});
        logger.info(`[UserRepository] Delete User End`);
        return user;
    }
    async getAllUsers(userFilter: IUserSearch): Promise<Pageable<IUser>> {
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
        return {
            data: user,
            paging: {
                current_page: userFilter.page,
                total_page: Math.ceil(total / userFilter.size),
                size: userFilter.size,
            },
        };
    }
}