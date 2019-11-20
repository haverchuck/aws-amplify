import { DeepDiff } from 'deep-diff';
import {
	AuthState,
	AuthStore,
	AuthStoreUpdate,
	InitStoreParams,
} from './types';
import { STRINGS } from './constants';

const createAuthStore = (storage, params: InitStoreParams) => {
	const newStore: AuthStore = {
		sessionId: params.sessionId,
		config: params.config,
		authState: AuthState.signedOut,
	};
	const sessionKey = `${STRINGS.AUTHSTORE_PREFIX}${newStore.sessionId}`;
	const existingSession = storage.getItem(sessionKey);
	if (!existingSession) {
		storage.setItem(sessionKey, JSON.stringify(newStore));
	}
	return sessionKey;
};

const updateAuthStore = (
	sessionId: string,
	newAuthStore: Partial<AuthStore>,
	storage
): AuthStoreUpdate => {
	let response: AuthStoreUpdate;
	let previous = storage.getItem(sessionId);
	let diff = DeepDiff(previous, newAuthStore);
	response = {
		previous,
		current: {
			sessionId,
			config: {},
			authState: newAuthStore.authState || previous.authState,
		},
		diff,
	};
	storage.setItem(sessionId, response.current);
	return response;
};

export { createAuthStore, updateAuthStore };
