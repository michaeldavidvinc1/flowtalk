import { TokenType } from "@prisma/client";
import ApiError from "../../src/utils/apiError";
import { AuthService } from "../../src/api/services/auth.service";

// mock bcrypt biar hash selalu "hashed-password"
jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashed-password"),
    compare: jest.fn(),
}));

// Mock dependency
const mockUserRepo = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
};

const mockTokenService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
};

const mockRedisService = {
    saveToken: jest.fn(),
};

// inject ke service
const service = new AuthService(
    mockUserRepo as any,
    mockTokenService as any,
    mockRedisService as any
);

describe("AuthService.register", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw error if email already exists", async () => {
        mockUserRepo.getUserByEmail.mockResolvedValue({ id: "1", email: "test@mail.com" });

        await expect(
            service.register({ email: "test@mail.com", password: "password", name: "Michael", avatarUrl: "avatar" })
        ).rejects.toThrow(ApiError);

        expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith("test@mail.com");
        expect(mockUserRepo.createUser).not.toHaveBeenCalled();
    });

    it("should create user, generate tokens and save to redis", async () => {
        mockUserRepo.getUserByEmail.mockResolvedValue(null);
        mockUserRepo.createUser.mockResolvedValue({ id: "123", email: "test@mail.com", name: "Michael" });

        mockTokenService.generateAccessToken.mockResolvedValue({
            token: "access-token",
            expires: new Date("2099-01-01"),
        });
        mockTokenService.generateRefreshToken.mockResolvedValue({
            token: "refresh-token",
            expires: new Date("2099-01-02"),
        });

        const result = await service.register({
            email: "test@mail.com",
            password: "password",
            name: "Michael",
            avatarUrl: "avatar",
        });

        expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith("test@mail.com");
        expect(mockUserRepo.createUser).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "test@mail.com",
                password: expect.stringMatching(/^\$2[aby]\$.{56}$/)
            })
        );

        expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith("123");
        expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith("123");

        expect(mockRedisService.saveToken).toHaveBeenCalledWith(
            "123",
            "access-token",
            new Date("2099-01-01"),
            TokenType.ACCESS
        );

        expect(result).toEqual({
            user: { id: "123", email: "test@mail.com", name: "Michael" },
            tokens: {
                access: { token: "access-token", expires: new Date("2099-01-01") },
                refresh: { token: "refresh-token", expires: new Date("2099-01-02") },
            },
        });
    });
});

describe("AuthService.login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw error email not found', async() => {
        mockUserRepo.getUserByEmail.mockResolvedValue(null);

        await expect(service.login({email: "test@gmail.com", password: "12345678"})).rejects.toThrow(ApiError);

        expect(mockUserRepo.getUserByEmail).toHaveBeenCalledWith("test@gmail.com")
        expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    });
})