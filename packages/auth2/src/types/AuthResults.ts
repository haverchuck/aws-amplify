import { AuthStore, AuthUser } from './';

type SignInResult = Pick<
	AuthStore,
	'authNProvider' & 'user' & 'authState' & 'tokens'
>;

type CredentialsResult = Pick<AuthStore, 'credentials'>;

type RefreshAuthUserResult = Partial<AuthUser>;

export { CredentialsResult, RefreshAuthUserResult, SignInResult };
