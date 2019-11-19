import { AuthStore, AuthStoreUpdate, IAuthClient, Auth0Params } from '../types';

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
		let signInEndpoint = `https://dev-mpndax-h.auth0.com/authorize?response_type=token%20id_token&client_id=${this.defaultHeaders.client_id}&redirect_uri=${this.defaultHeaders.redirect_uri}&scope=openid`;
		let result = await fetch(signInEndpoint, this.defaultOptions);
		return result;
	};
}

export { Auth0Client };
