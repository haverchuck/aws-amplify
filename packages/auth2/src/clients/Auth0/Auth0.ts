import {
	AuthStore,
	AuthStoreUpdate,
	IAuthClient,
	SignInParams,
	SignInResult,
} from '../../types';
import { Auth0Params } from './';
import { launchUri } from '../../utils';

class Auth0Client implements IAuthClient {
	clientParameters;
	defaultHeaders;
	defaultOptions;
	endpoint;
	name = 'Auth0Client';

	constructor(
		auth0Params: Auth0Params,
		clientConfiguration?: Partial<IAuthClient>
	) {
		this.endpoint = auth0Params.endpoint;
		this.clientParameters = {
			clientId: auth0Params.client_id,
		};
		this.defaultHeaders = {
			response_type: 'token',
			client_id: auth0Params.client_id,
			redirect_uri: 'http://localhost:3000',
		};
		this.defaultOptions = {
			headers: this.defaultHeaders,
			method: 'GET',
			mode: 'no-cors',
		};
	}

	signIn = async signInParams => {
		let signInEndpoint = `https://dev-mpndax-h.auth0.com/authorize?response_type=code&client_id=${this.defaultHeaders.client_id}&redirect_uri=${this.defaultHeaders.redirect_uri}&scope=openid`;
		launchUri(signInEndpoint);

		let result: SignInResult;
		return result;
	};

	storagePrefix() {
		return this.clientParameters.clientId;
	}
}

export { Auth0Client };
