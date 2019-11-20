import { AuthStore, GeneralAuthError, SignInParams, SignInResult } from './';

interface IAuthClient {
	defaultHeaders: any;
	defaultOptions: any;
	endpoint: string;
	name: string;
	clientParameters?: any;
	urlListener?: UrlListener;
	signIn: (signInParams: SignInParams) => Promise<SignInResult>;
	storagePrefix: () => string;
}

type UrlListener = {
	onLoad: Function;
};

export { IAuthClient, UrlListener };
