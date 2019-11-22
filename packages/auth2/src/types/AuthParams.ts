import { Tokens } from './';

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
};

export { BaseParams, PrepareCredentialsParams, SignInParams };
