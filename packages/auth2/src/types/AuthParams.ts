type BaseParams = {
	headers?: any;
	options?: any;
};

type SignInParams = BaseParams & {
	username: string;
	password?: string;
};

export { BaseParams, SignInParams };
