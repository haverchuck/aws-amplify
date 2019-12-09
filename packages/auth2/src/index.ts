/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import { AuthClassTest } from './Auth2';
import { Auth0Client, CognitoIdentityPoolClient, CognitoUserPoolClient } from './clients';

import { Amplify, ConsoleLogger as Logger } from '@aws-amplify/core';


const logger = new Logger('Auth');

let _instance: AuthClassTest = null;

if (!_instance) {
	logger.debug('Create Auth Instance');
	_instance = new AuthClassTest();
}

const Auth2 = _instance;

/**
 * @deprecated use named import
 */
export default Auth2;
export {
	Auth2,
	AuthClassTest,
	CognitoIdentityPoolClient,
	CognitoUserPoolClient
};
