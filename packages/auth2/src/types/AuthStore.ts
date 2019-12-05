type AuthStore = {
	sessionId: string;
	authNProvider?: string;
	credentials?: {
		clockDrift?: number;
		tokens: Tokens;
		providerCredentials?: any;
	};
	device?: {
		deviceKey?: string;
		pushToken?: string;
	};
	user?: AuthUser;
	config: any;
	authState: AuthState;
};

type Tokens = {
	accessToken?: string;
	idToken?: string;
	refreshToken?: string;
	expiresAt?: string;
};

type AuthUser = {
	isGuest?: boolean;
	attributes: {
		// standard attributes from OIDC spec
		aud?: string;
		iat?: string;
		iss?: string;
		exp?: string;
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
	diff: Partial<AuthStore>;
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
	AuthUser,
	OAuthProvider,
	OAuthFlows,
	InitStoreParams,
	Tokens,
};
