export interface IRowndContext {
    requestSignIn: (opts: RequestSignInOpts) => void;
    signOut: () => void;
    getAccessToken: Function;
    is_authenticated: boolean;
    is_initializing: boolean;
    access_token: string | null;
    auth: IAuthContext;
    user: IUserContext;
};

interface IAuthContext {
    access_token: string | null;
    app_id?: string;
    is_authenticated: boolean;
    is_verified_user?: boolean;
};

interface IUserContext {
    data: {
        id?: string;
        email?: string | null;
        phone?: string | null;
        [key: string]: any;
    };
    redacted_fields: string[];
};

interface RequestSignInOpts {
    identifier?: string;
    auto_sign_in?: boolean;
    init_data?: Record<string, any>;
}
