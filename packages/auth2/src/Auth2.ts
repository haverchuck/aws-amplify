import {
	AuthConfig,
	BaseParams,
	IAuthClient,
	AuthStoreUpdate,
	AuthStore,
	PrepareCredentialsParams,
	Tokens,
	SignInParams,
	RefreshAuthUserParams,
	CredentialsResult,
} from './types';
import {
	Amplify,
	Hub,
	JS,
	Parser,
	Logger,
} from '@aws-amplify/core';
import { CognitoUserPoolClient, CognitoIdentityPoolClient } from './clients';
import { StorageHelper } from './DefaultStorage';
import { createAuthStore, getAuthStore, updateAuthStore } from './AuthStore';
import { selectClient } from './AuthMediator';

const AMPLIFY_SYMBOL = (typeof Symbol !== 'undefined' &&
	typeof Symbol.for === 'function'
	? Symbol.for('amplify_default')
	: '@@amplify_default') as Symbol;

const logger = new Logger('Auth2Class');



const dispatchAuthEvent = (event: string, data: any, message: string) => {
	Hub.dispatch('auth', { event, data, message }, 'Auth', AMPLIFY_SYMBOL);
};

export class AuthClassTest {
	private _config: AuthConfig;
	private _currentSessionId: string;
	public credentials: CredentialsResult;
	public defaultNClient: IAuthClient;
	public defaultZClient: IAuthClient;

	public availableClients: IAuthClient[];
	public storage: any;

	constructor(config) {
		// this.configure(config);
		Amplify.register(this);

	}

	configure(config?) {
		// if (!config) return this._config;
		logger.debug('configure Auth2', config);
		this._config = Object.assign(
			{},
			config
		);

		// if 'clients' property is missing, we assume legacy configuration of single userpool/idpool
		if (!this._config.clients || (this._config.clients && this._config.clients.length < 1)) {
			this.defaultNClient = CognitoUserPoolClient(config);
			this.defaultZClient = CognitoIdentityPoolClient(config);
		}
		this.storage = new StorageHelper().storageWindow;
		this._currentSessionId = createAuthStore(this.storage, {
			sessionId: this.defaultNClient.storagePrefix(),
			config,
		});

		return this._config;
	}

	public async signIn(signInParams: SignInParams, client?: IAuthClient) {
		let result = await selectClient(this.defaultNClient, client).signIn({
			username: signInParams.username,
			password: signInParams.password,
		});
		let updateResponse = updateAuthStore(
			this._currentSessionId,
			result,
			this.storage
		);

		this.credentials = await this.prepareCredentials({
			tokens: updateResponse.current.credentials.tokens as Tokens,
			authNProvider: updateResponse.current.authNProvider,
			config: updateResponse.current.config,
		});
		let credentials = Object.assign(
			{ tokens: updateResponse.current.credentials.tokens },
			{ providerCredentials: { ...this.credentials } }
		);

		updateAuthStore(this._currentSessionId, { credentials }, this.storage);
	}

	public async refreshAuthUser(
		refreshUserParams?: RefreshAuthUserParams,
		client?: IAuthClient
	) {
		const result = await selectClient(
			this.defaultNClient,
			client
		).refreshAuthUser(refreshUserParams);

		let user = Object.assign(
			getAuthStore(this._currentSessionId, this.storage).user,
			result
		);

		updateAuthStore(this._currentSessionId, { user }, this.storage);
	}

	public getStore() {
		return getAuthStore(this._currentSessionId, this.storage);
	}

	public async prepareCredentials(
		prepareCredentialsParams: PrepareCredentialsParams
	) {
		// check existing credentails
		let { client, tokens, authNProvider, config } = prepareCredentialsParams;

		// potentially refresh access token

		//then prep credentials
		let result = await selectClient(
			this.defaultZClient,
			client
		).prepareCredentials({ tokens, authNProvider, config });
		return result;
	}

	public getModuleName() {
		return 'Auth2';
	}

	public addPluggable() { }
}

export default AuthClassTest;
