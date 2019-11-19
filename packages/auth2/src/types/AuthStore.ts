type AuthStore = {
	sessionId: string;
	credentials?: {
		clockDrift?: number;
		tokens: {
			accessToken?: string;
			idToken?: string;
			refreshToken?: string;
			expiresAt?: string;
		};
		providerCredentials?: {
			secretKey?: string;
			secretAccessKey?: string;
			sessionToken?: string;
			expiresAt?: string;
			providerSpecific?: any;
		};
	};
	device?: {
		deviceKey?: string;
		pushToken?: string;
	};
	user?: {
		isGuest: boolean;
		attributes: {
			// standard attributes from OIDC spec
			sub?: string;
			name?: string;
			given_name?: string;
			family_name?: string;
			middle_name?: string;
			nickname?: string;
			preferred_username?: string;
			profile?: string;
			picture?: string;
			website?: string;
			email?: string;
			email_verified?: boolean;
			gender?: string;
			birthdate?: string;
			zoneinfo?: string;
			locale?: string;
			phone_number?: string;
			phone_number_verified?: boolean;
			address?: any;
			updated_at?: number;
			// storage of non-standard attributes
			providerAttributes?: any;
		};
	};
	config: any;
	authState: AuthState;
};

enum AuthState {
	signedOut = 'signedOut',
	signedIn = 'signedIn',
	signingUp = 'signingUp',
	confirmingSignUp = 'confirmingSignUp',
	confirmingSignUpCustomFlow = 'confirmingSignUpCustomFlow',
	confirmingSignIn = 'confirmingSignIn',
	confirmingSignInCustomFlow = 'confirmingSignInCustomFlow',
	verifyingAttributes = 'verifyingAttributes',
	forgotPassword = 'forgotPassword',
	resettingPassword = 'resettingPassword',
	settingMFA = 'settingMFA',
}

type OAuthProvider = {
	name: string;
	providerData: any;
	flowType: OAuthFlows;
};

type AuthStoreUpdate = {
	previous: AuthStore;
	current: AuthStore;
};

enum OAuthFlows {
	ImplicitGrant,
	AuthorizationCodeGrant,
}

type InitStoreParams = {
	sessionId: string;
	config: any;
};

export {
	AuthStore,
	AuthStoreUpdate,
	AuthState,
	OAuthProvider,
	OAuthFlows,
	InitStoreParams,
};
