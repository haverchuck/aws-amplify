import { DeepDiff } from 'deep-diff';
import { AuthState, AuthStore, InitStoreParams } from './types';
import { STRINGS } from './constants';
import { stringList } from 'aws-sdk/clients/datapipeline';

const createAuthStore = (storage, params: InitStoreParams) => {
	const newStore: AuthStore = {
		sessionId: params.sessionId,
		config: params.config,
		authState: AuthState.signedOut,
	};
	storage.setItem(
		`${STRINGS.AUTHSTORE_PREFIX}${newStore.sessionId}`,
		JSON.stringify(newStore)
	);
};

const updateAuthStore = (newAuthStore: Partial<AuthStore>, storage) => {};

export { createAuthStore, updateAuthStore };
