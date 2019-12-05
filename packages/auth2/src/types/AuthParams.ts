import { AuthUser, Tokens } from './';

type BaseParams = {
	headers?: any;
	options?: any;
	client?: any;
};

type SignInParams = BaseParams & {
	username: string;
	password?: string;
};

type PrepareCredentialsParams = BaseParams & {
	tokens: Tokens;
	authNProvider: string;
	config: any;
};

type RefreshAuthUserParams = BaseParams & {
	searchParams?: Partial<AuthUser> & Partial<Tokens>;
};

export {
	BaseParams,
	PrepareCredentialsParams,
	RefreshAuthUserParams,
	SignInParams,
};
