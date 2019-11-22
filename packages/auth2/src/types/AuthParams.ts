type BaseParams = {
	headers?: any;
	options?: any;
};

type SignInParams = BaseParams & {
	username: string;
	password?: string;
};

type PrepareCredentialsParams = BaseParams;

export { BaseParams, PrepareCredentialsParams, SignInParams };
