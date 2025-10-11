import {IUserCreate, IUserSearch, IUserUpdate} from "../../../interface/user.interface";
import {Pageable} from "../../../interface/page";
import {UserEntity} from "../../../entity/user.entity";

export interface UserRepositoryImpl {
    createUser(userData: IUserCreate): Promise<UserEntity>;
    getUserById(id: string): Promise<UserEntity | null>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    updateUser(id: string, userData: IUserUpdate): Promise<UserEntity>;
    deleteUser(id: string): Promise<UserEntity>;
    getAllUsers(userFilter: IUserSearch): Promise<Pageable<UserEntity>>;
}