import {
	AuthStore,
	AuthStoreUpdate,
	IAuthClient,
	SignInParams,
	SignInResult,
} from '../../types';
import { CognitoUserPoolParams } from './';
import { AuthenticationHelper, BigInteger, DateHelper } from '../../utils';
import { updateAuthStore } from '../../AuthStore';
import CryptoJS from 'crypto-js/core';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';

class CognitoUserPoolClientClass implements IAuthClient {
	clientParameters;
	dateHelper = new DateHelper();
	authenticationHelper;
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

	constructor(cognitoUserPoolParams: CognitoUserPoolParams) {
		this.clientParameters = {
			userPoolId: cognitoUserPoolParams.aws_user_pools_id,
			userPoolWebClientId: cognitoUserPoolParams.aws_user_pools_web_client_id,
			region: cognitoUserPoolParams.aws_cognito_region,
			identityPoolId: cognitoUserPoolParams.aws_cognito_identity_pool_id,
		};
		this.endpoint = `https://cognito-idp.${cognitoUserPoolParams.aws_cognito_region}.amazonaws.com/`;
		this.authenticationHelper = new AuthenticationHelper(
			cognitoUserPoolParams.aws_user_pools_id
		);
	}

	signIn = async (signInParams: SignInParams) => {
		// WILL PROBABLY MOVE THIS TO ANOTHER FUNCTION, AS NOT ALL FLOWS USE SRP
		let srp;
		this.authenticationHelper.getLargeAValue((errOnAValue, aValue) => {
			// getLargeAValue callback start
			if (errOnAValue) {
				console.log('FAILED');
			}
			srp = aValue.toString(16);
		});

		let options = this.formOptions(
			'InitiateAuth',
			signInParams.headers,
			signInParams.options
		);
		options.body = JSON.stringify({
			AuthFlow: 'USER_SRP_AUTH',
			AuthParameters: {
				USERNAME: signInParams.username,
				SRP_A: srp,
			},
			ClientId: this.clientParameters.userPoolWebClientId,
		});
		let result = await fetch(this.endpoint, options);
		let data = await result.json();
		let signInResult: SignInResult;

		if (!data) {
			return signInResult;
		}

		let res = await this.parseSignInResponse(data, signInParams);
	};

	private parseSignInResponse = async (data, params) => {
		switch (data.ChallengeName) {
			case 'PASSWORD_VERIFIER':
				await this.passwordVerifierResponse(data, params);
				break;
			default:
				throw new Error('Unrecognized Challenge Name');
		}
	};

	private passwordVerifierResponse = async (
		data: any,
		params: SignInParams
	) => {
		const challengeParameters = data.ChallengeParameters;
		const username = challengeParameters.USER_ID_FOR_SRP;
		const serverB = new BigInteger(challengeParameters.SRP_B, 16);
		const salt = new BigInteger(challengeParameters.SALT, 16);
		const date = this.dateHelper.getNowString();
		const hkdf = this.authenticationHelper.getPasswordAuthenticationKey(
			username,
			params.password,
			serverB,
			salt
		);
		const message = CryptoJS.lib.WordArray.create(
			Buffer.concat([
				Buffer.from(this.clientParameters.userPoolId.split('_')[1], 'utf8'),
				Buffer.from(username, 'utf8'),
				Buffer.from(challengeParameters.SECRET_BLOCK, 'base64'),
				Buffer.from(date, 'utf8'),
			])
		);
		const key = CryptoJS.lib.WordArray.create(hkdf);
		const signatureString = Base64.stringify(HmacSHA256(message, key));
		const challengeResponses = {
			USERNAME: username,
			PASSWORD_CLAIM_SECRET_BLOCK: challengeParameters.SECRET_BLOCK,
			TIMESTAMP: date,
			PASSWORD_CLAIM_SIGNATURE: signatureString,
		};

		let res = await this.respond2AuthChallenge(
			'PASSWORD_VERIFIER',
			challengeResponses
		);

		// if (this.deviceKey != null) {
		// 	challengeResponses.DEVICE_KEY = this.deviceKey;
		// }
	};

	private formOptions = (
		operation: string,
		passedHeaders?: any,
		passedOptions?: any
	) => {
		let headers = Object.assign(this.defaultHeaders, passedHeaders);
		let options = Object.assign(this.defaultOptions, passedOptions);
		headers['X-Amz-Target'] = `${headers['X-Amz-Target']}.${operation}`;
		options.headers = headers;
		return options;
	};

	private respond2AuthChallenge = async (challenge, response) => {
		let options = this.formOptions(challenge);
		options.body = JSON.stringify({
			ChallengeName: challenge,
			ChallengeResponses: response,
			ClientId: this.clientParameters.userPoolWebClientId,
		});
		let result = await fetch(this.endpoint, options);
		return result;
	};

	storagePrefix() {
		return this.clientParameters.userPoolWebClientId;
	}
}

const CognitoUserPoolClient = (
	config: CognitoUserPoolParams,
	modifiedClient?: Partial<IAuthClient>
): IAuthClient => {
	return Object.assign(
		new CognitoUserPoolClientClass(config),
		modifiedClient
	) as IAuthClient;
};

export { CognitoUserPoolClient };
