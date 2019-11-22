import { AuthConfig, IAuthClient, AuthStoreUpdate } from './types';
import { CognitoUserPoolClient, CognitoIdentityPoolClient } from './clients';
import { StorageHelper } from './DefaultStorage';
import { createAuthStore, updateAuthStore } from './AuthStore';
import { selectClient } from './AuthMediator';

export default class AuthClassTest {
	private _config: AuthConfig;
	private _currentSessionId: string;
	public defaultNClient: IAuthClient;
	public defaultZClient: IAuthClient;

	public availableClients: IAuthClient[];
	public storage: any;

	constructor(options?) {
		console.log('CONSTRUCTED');
	}

	configure(config) {
		console.log('CONFIGURED');
		// if 'clients' property is missing, we assume legacy configuration of single userpool/idpool
		if (!config.clients || config.clients.length < 1) {
			this.defaultNClient = CognitoUserPoolClient(config);
			this.defaultZClient = CognitoIdentityPoolClient(config);
		}
		this.storage = new StorageHelper().storageWindow;
		this._currentSessionId = createAuthStore(this.storage, {
			sessionId: this.defaultNClient.storagePrefix(),
			config,
		});
	}

	public async signIn(
		username: string,
		password: string,
		client?: IAuthClient
	) {
		let result = await selectClient(this.defaultNClient, client).signIn({
			username,
			password,
		});
		let updateResponse = updateAuthStore(
			this._currentSessionId,
			result,
			this.storage
		);
	}

	public async prepareCredentials(client?: IAuthClient) {
		// check existing credentails

		// potentially refresh access token

		//then prep credentials
		let result = await selectClient(
			this.defaultZClient,
			client
		).prepareCredentials();
		return result;
	}

	public getModuleName() {
		return 'Auth';
	}

	public addPluggable() {}
}
