import { AuthStore } from './';

type SignInResult = Pick<AuthStore, 'user' & 'authState'>;

export { SignInResult };
