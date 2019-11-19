import { Parser } from '@aws-amplify/core';
import { AuthConfig, IAuthClient } from './types';
import { Auth0Client, CognitoUserPoolClient } from './clients';
import { StorageHelper } from './DefaultStorage';
import { createAuthStore, updateAuthStore } from './AuthStore';

export default class AuthClassTest {
	private _config: AuthConfig;
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
			this.defaultClient = new CognitoUserPoolClient(config) as IAuthClient;
		}
		this.storage = new StorageHelper().storageWindow;
		createAuthStore(this.storage, {
			sessionId: this.defaultClient.storagePrefix(),
			config,
		});
	}

	public async signIn(username: string, password: string, client?: string) {
		let result = await this.defaultClient.signIn({ username, password });
	}

	public getModuleName() {
		return 'Auth';
	}
}
