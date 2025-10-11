export interface IUser {
    id: string;
    email: string;
    name: string;
    isEmailVerified: boolean;
    avatarUrl: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserSearch {
    name?: string;
    email?: string;
    page: number;
    size: number;
}

export interface IUserCreate {
    email: string;
    password: string;
    name: string;
    avatarUrl: string;
    lastSeen?: Date;
}

export interface IUserUpdate {
    email?: string;
    password?: string;
    name?: string;
    avatarUrl?: string;
    lastSeen?: Date;
}