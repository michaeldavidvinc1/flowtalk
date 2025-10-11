import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import moment from "moment-timezone";

export class UserEntity {
    constructor(
        public id: string,
        public email: string,
        private passwordHash: string,
        public name: string,
        public isEmailVerified: boolean,
        public lastSeen: Date | null,
        public avatarUrl: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}

    async verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private formatDate(date: Date): string {
        return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    }

    static fromPrisma(user: User): UserEntity {
        return new UserEntity(
            user.id,
            user.email,
            user.password,
            user.name,
            user.isEmailVerified,
            user.lastSeen,
            user.avatarUrl,
            user.createdAt,
            user.updatedAt,
        );
    }

    toResponse() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            avatarUrl: this.avatarUrl,
            isEmailVerified: this.isEmailVerified,
            lastSeen: this.lastSeen ? this.formatDate(this.lastSeen) : null,
            createdAt: this.formatDate(this.createdAt),
            updatedAt: this.formatDate(this.updatedAt),
        };
    }
}
