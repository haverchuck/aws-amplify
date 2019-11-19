import {
	AuthStore,
	AuthStoreUpdate,
	IAuthClient,
	CognitoUserPoolParams,
} from '../types';

import { AuthenticationHelper } from '../utils';

class CognitoUserPoolClient implements IAuthClient {
	clientParameters;
	endpoint;
	name = 'CognitoUserPoolClient';
	defaultHeaders = {
		'Content-Type': 'application/x-amz-json-1.1',
		'X-Amz-Target': `AWSCognitoIdentityProviderService`,
		'X-Amz-User-Agent': 'aws-amplify/0.1.x js',
	};

	defaultOptions = {
		headers: this.defaultHeaders,
		method: 'POST',
		mode: 'cors' as RequestMode,
		cache: 'no-cache' as RequestCache,
	};

	constructor(
		cognitoUserPoolParams: CognitoUserPoolParams,
		clientConfiguration?: Partial<IAuthClient>
	) {
		this.clientParameters = {
			userPoolId: cognitoUserPoolParams.aws_user_pools_id,
			userPoolWebClientId: cognitoUserPoolParams.aws_user_pools_web_client_id,
			region: cognitoUserPoolParams.aws_cognito_region,
			identityPoolId: cognitoUserPoolParams.aws_cognito_identity_pool_id,
			authenticationHelper: new AuthenticationHelper(
				cognitoUserPoolParams.aws_user_pools_id
			),
		};
		this.endpoint = `https://cognito-idp.${cognitoUserPoolParams.aws_cognito_region}.amazonaws.com/`;
	}

	signIn = async signInParams => {
		let srp;

		this.clientParameters.authenticationHelper.getLargeAValue(
			(errOnAValue, aValue) => {
				// getLargeAValue callback start
				if (errOnAValue) {
					console.log('FAILED');
				}
				srp = aValue.toString(16);
			}
		);

		let options = Object.assign(this.defaultOptions, {
			headers: {
				'X-Amz-Target': `${this.defaultHeaders['X-Amz-Target']}.InitiateAuth`,
			},
			body: JSON.stringify({
				AuthFlow: 'USER_SRP_AUTH',
				AuthParameters: {
					USERNAME: signInParams.username,
					SRP_A: srp,
				},
				ClientId: this.clientParameters.userPoolWebClientId,
			}),
		});
		let result = await fetch(this.endpoint, options);
		return result;
	};
}

export { CognitoUserPoolClient };
