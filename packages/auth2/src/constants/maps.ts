import { AuthState } from '../types';

enum CLIENT_SOURCE {
	defaultAuthN = 'defaultAuthN',
	customAuthN = 'customAuthN',
	lastAuthN = 'lastAuthN',
	defaultAuthZ = 'defaultAuthZ',
	customAuthZ = 'customAuthZ',
	lastAuthZ = 'lastAuthZ',
}

let DEFAULT_STATE_MAP = {};
DEFAULT_STATE_MAP[AuthState.signedOut] = CLIENT_SOURCE.defaultAuthN;

const MAPS = {
	DEFAULT_STATE_MAP,
};

export { MAPS };
