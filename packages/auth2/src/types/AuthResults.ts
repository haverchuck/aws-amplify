import { AuthStore } from './';

type SignInResult = Pick<AuthStore, 'user' & 'authState' & 'tokens'>;

export { SignInResult };
