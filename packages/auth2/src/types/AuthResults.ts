import { AuthStore, AuthUser } from './';

type SignInResult = Pick<
	AuthStore,
	'authNProvider' & 'user' & 'authState' & 'tokens'
	>;

type CredentialsResult = {
	accessKeyId: string,
	sessionToken: string,
	secreateAccessKey: string,
};

type RefreshAuthUserResult = Partial<AuthUser>;

export { CredentialsResult, RefreshAuthUserResult, SignInResult };
