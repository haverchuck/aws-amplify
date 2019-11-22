import {
	AuthConfig,
	BaseParams,
	IAuthClient,
	AuthStoreUpdate,
	PrepareCredentialsParams,
} from './types';
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

	public async signIn(signInParams, client?: IAuthClient) {
		let result = await selectClient(this.defaultNClient, client).signIn({
			username: signInParams.username,
			password: signInParams.password,
		});
		let updateResponse = updateAuthStore(
			this._currentSessionId,
			result,
			this.storage
		);
	}

	public async prepareCredentials(
		prepareCredentialsParams: PrepareCredentialsParams
	) {
		// check existing credentails
		let tokens = this.storage.getItem(this._currentSessionId).tokens;

		// potentially refresh access token

		//then prep credentials
		let result = await selectClient(
			this.defaultZClient,
			prepareCredentialsParams.client
		).prepareCredentials({ tokens });
		return result;
	}

	public getModuleName() {
		return 'Auth';
	}

	public addPluggable() {}
}
