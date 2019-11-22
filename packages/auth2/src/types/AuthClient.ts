import {
	AuthStore,
	GeneralAuthError,
	BaseParams,
	CredentialsResult,
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
	prepareCredentials?: (
		prepareCredentials: PrepareCredentialsParams
	) => Promise<CredentialsResult>;
}

type UrlListener = {
	onLoad: Function;
};

export { IAuthClient, UrlListener };
