import { Parser } from '@aws-amplify/core';
import { AuthConfig, IAuthClient, AuthStoreUpdate } from './types';
import { Auth0Client, CognitoUserPoolClient } from './clients';
import { StorageHelper } from './DefaultStorage';
import { createAuthStore, updateAuthStore } from './AuthStore';
import { selectClient } from './AuthMediator';

export default class AuthClassTest {
	private _config: AuthConfig;
	private _currentSessionId: string;
	public defaultClient: IAuthClient;
	public availableClients: IAuthClient[];
	public storage: any;

	constructor(options?) {
		console.log('CONSTRUCTED');
	}

	configure(config) {
		console.log('CONFIGURED');
		// if 'clients' property is missing, we assume legacy configuration of single userpool/idpool
		if (!config.clients || config.clients.length < 1) {
			this.defaultClient = CognitoUserPoolClient(config) as IAuthClient;
		}
		this.storage = new StorageHelper().storageWindow;
		this._currentSessionId = createAuthStore(this.storage, {
			sessionId: this.defaultClient.storagePrefix(),
			config,
		});
	}

	public async signIn(
		username: string,
		password: string,
		client?: IAuthClient
	) {
		let result = await selectClient(this.defaultClient, client).signIn({
			username,
			password,
		});
		let updateResponse = updateAuthStore(
			this._currentSessionId,
			result,
			this.storage
		);
	}

	public getModuleName() {
		return 'Auth';
	}
}
