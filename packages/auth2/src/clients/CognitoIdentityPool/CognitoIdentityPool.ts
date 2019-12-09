import {
	AuthState,
	AuthStore,
	AuthStoreUpdate,
	AuthUser,
	CredentialsResult,
	IAuthClient,
	SignInParams,
	SignInResult,
	PrepareCredentialsParams,
} from '../../types';
import { CognitoIdentityPoolParams } from './';

class CognitoIdentityPoolClientClass implements IAuthClient {
	clientParameters;
	authenticationHelper;
	endpoint;
	name = 'CognitoUserPoolClient';
	defaultHeaders = {
		'Content-Type': 'application/x-amz-json-1.1',
		'X-Amz-Target': `AWSCognitoIdentityService`,
		'X-Amz-User-Agent': 'aws-amplify/0.1.x js',
	};

	defaultOptions = {
		headers: this.defaultHeaders,
		method: 'POST',
		mode: 'cors' as RequestMode,
		cache: 'no-cache' as RequestCache,
	};

	constructor(cognitoIdentityPoolParams) {
		let idPoolConfig: CognitoIdentityPoolParams;

		if (
			cognitoIdentityPoolParams.plugins &&
			cognitoIdentityPoolParams.plugins.length > 0
		) {
			idPoolConfig = cognitoIdentityPoolParams.plugins.find(
				i => i.pluginName === 'CognitoPlugin'
			).pluginConfig;
		} else if (cognitoIdentityPoolParams.Auth2) {
			idPoolConfig = cognitoIdentityPoolParams.Auth2.plugins.find(
				i => i.pluginName === 'CognitoPlugin'
			).pluginConfig;
		} else {
			idPoolConfig = cognitoIdentityPoolParams;
		}

		this.clientParameters = {
			identityPoolId: idPoolConfig.aws_cognito_identity_pool_id,
			userPoolId: idPoolConfig.aws_user_pools_id,
			region: idPoolConfig.aws_cognito_region,
		};
		this.endpoint = `https://cognito-identity.${idPoolConfig.aws_cognito_region}.amazonaws.com/`;
	}

	public prepareCredentials = async (
		prepareCredentialsParams: PrepareCredentialsParams
	) => {
		const {
			headers,
			options,
			authNProvider,
			tokens,
			config,
		} = prepareCredentialsParams;

		let requestOptions = this.formOptions('GetId', headers, options);

		const logins = {};
		switch (authNProvider) {
			case 'Cognito':
				logins[
					`cognito-idp.us-east-2.amazonaws.com/${this.clientParameters.userPoolId}`
				] = tokens.idToken;
				break;
			default:
				//TODO: REAL ERROR HANDLING HERE
				console.log('could not detect auth provider');
		}

		requestOptions.body = JSON.stringify({
			IdentityPoolId: this.clientParameters.identityPoolId,
			Logins: logins,
		});

		let identityRequest = await fetch(this.endpoint, requestOptions);
		let { IdentityId } = await identityRequest.json();

		requestOptions = this.formOptions(
			'GetCredentialsForIdentity',
			headers,
			options
		);

		requestOptions.body = JSON.stringify({
			IdentityId,
			Logins: logins,
		});

		let credentialsRequest = await fetch(this.endpoint, requestOptions);
		let creds = await credentialsRequest.json();
		return {
			accessKeyId: creds.Credentials.AccessKeyId,
			sessionToken: creds.Credentials.SessionToken,
			secreateAccessKey: creds.Credentials.SecretKey,
		}
	};

	private formOptions = (
		operation: string,
		passedHeaders?: any,
		passedOptions?: any
	) => {
		let headers = Object.assign({}, this.defaultHeaders, passedHeaders);
		let options = Object.assign({}, this.defaultOptions, passedOptions);
		headers['X-Amz-Target'] = `${headers['X-Amz-Target']}.${operation}`;
		options.headers = headers;
		return options;
	};
}

const CognitoIdentityPoolClient = (
	config: CognitoIdentityPoolParams,
	modifiedClient?: Partial<IAuthClient>
): IAuthClient => {
	return Object.assign(
		new CognitoIdentityPoolClientClass(config),
		modifiedClient
	) as IAuthClient;
};

export { CognitoIdentityPoolClient };
