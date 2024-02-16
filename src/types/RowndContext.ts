export interface IRowndContext {
    requestSignIn: (opts: RequestSignInOpts) => void;
    signOut: () => void;
    getAccessToken: Function;
    is_authenticated: boolean;
    is_initializing: boolean;
    access_token: string | null;
    auth: IAuthContext;
    user: IUserContext;
    near: INearContext;
};

interface IAuthContext {
    access_token: string | null;
    app_id?: string;
    is_authenticated: boolean;
    is_verified_user?: boolean;
};

type UserData = {
    user_id?: string;
    email?: string | null;
    [key: string]: any;
};

interface IUserContext {
    manageAccount: () => void;
    set: (data: UserData) => Promise<UserData> | undefined;
    setValue: (key: string, value: any) => Promise<UserData> | undefined;
    uploadFile: (field: string, file: File) => Promise<any>;
    data: UserData;
    redacted_fields: string[];
};

interface INearContext {
    createNamedAccount: () => void;
    ensureImplicitAccount: () => Promise<string>;
    walletDetails: () => void;
}

type RequestSignInOpts = {
    identifier?: string;
    auto_sign_in?: boolean;
    init_data?: Record<string, any>;
    user_data?: Record<string, any>;
    post_login_redirect?: string;
    login_step?: LoginStep;
    include_user_data?: boolean;
    redirect?: boolean;
    intent?: RequestSignInIntent;
    group_to_join?: string;
  } & (
    | {
        method?: never;
      }
    | {
        method: 'one_tap';
        method_options?: {
          prompt_parent_id?: string;
        };
      }
    | {
        method: 'email' | 'phone' | 'google' | 'apple' | 'passkeys' | 'anonymous';
      }
  );

  export enum RequestSignInIntent {
    SignUp = 'sign_up',
    SignIn = 'sign_in',
  }

  export enum LoginStep {
    INIT = 'init',
    NO_ACCOUNT = 'no_account',
    SUCCESS = 'success',
    ERROR = 'error',
    COMPLETING = 'completing',
  }
