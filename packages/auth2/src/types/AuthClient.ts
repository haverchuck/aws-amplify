import {
	AuthStore,
	GeneralAuthError,
	PrepareCredentialsParams,
	SignInParams,
	SignInResult,
} from './';

interface IAuthClient {
	name: string;
	defaultHeaders?: any;
	defaultOptions?: any;
	endpoint: string;
	clientParameters?: any;
	urlListener?: UrlListener;
	signIn?: (signInParams: SignInParams) => Promise<SignInResult>;
	storagePrefix?: () => string;
	prepareCredentials?: (prepareCredParams: PrepareCredentialsParams) => {};
}

type UrlListener = {
	onLoad: Function;
};

export { IAuthClient, UrlListener };
