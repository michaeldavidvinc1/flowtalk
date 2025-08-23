export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    avatarUrl: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    tokens: {
        access: {
            token: string;
            expires: Date;
        };
        refresh: {
            token: string;
            expires: Date;
        };
    };
}
