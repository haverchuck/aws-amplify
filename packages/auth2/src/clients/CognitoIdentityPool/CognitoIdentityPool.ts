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

	constructor(cognitoIdentityPoolParams: CognitoIdentityPoolParams) {
		this.clientParameters = {
			identityPoolId: cognitoIdentityPoolParams.aws_cognito_identity_pool_id,
			region: cognitoIdentityPoolParams.aws_cognito_region,
		};
		this.endpoint = `https://cognito-identity.${cognitoIdentityPoolParams.aws_cognito_region}.amazonaws.com/`;
	}

	public prepareCredentials = async (
		prepareCredentialsParams: PrepareCredentialsParams
	) => {
		let options = this.formOptions(
			'GetId',
			prepareCredentialsParams.headers,
			prepareCredentialsParams.options
		);

		options.body = JSON.stringify({
			IdentityPoolId: '',
			Logins: logins,
		});
		let result: CredentialsResult;
		return result;
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
