type CognitoUserAttributes = {
	auth_time?: string;
	event_id?: string;
	token_use?: string;
	Username?: string;
	customAttributes?: { [key: string]: string };
};

export { CognitoUserAttributes };
