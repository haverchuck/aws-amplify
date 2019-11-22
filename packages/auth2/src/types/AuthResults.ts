import { AuthStore } from './';

type SignInResult = Pick<AuthStore, 'user' & 'authState' & 'tokens'>;

type CredentialsResult = Pick<AuthStore, 'credentials'>;

export { CredentialsResult, SignInResult };
