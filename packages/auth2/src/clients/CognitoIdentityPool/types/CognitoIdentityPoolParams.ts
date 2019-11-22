import { PrepareCredentialsParams } from '../../../types';

type CognitoIdentityPoolParams = {
	aws_cognito_region: string;
	aws_cognito_identity_pool_id: string;
};

type PrepareCognitoCredentialParams = PrepareCredentialsParams & {
	logins: { [key: string]: string };
};

export { CognitoIdentityPoolParams, PrepareCognitoCredentialParams };
