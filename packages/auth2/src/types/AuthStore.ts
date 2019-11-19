type AuthStore = {
	plugin: string;
	sessionId: string;
	credentials: {
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
	device: {
		deviceKey?: string;
		pushToken?: string;
	};
	user: {
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
	signedOut,
	signedIn,
	signingUp,
	confirmingSignUp,
	confirmingSignUpCustomFlow,
	confirmingSignIn,
	confirmingSignInCustomFlow,
	verifyingAttributes,
	forgotPassword,
	resettingPassword,
	settingMFA,
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

export { AuthStore, AuthStoreUpdate, AuthState, OAuthProvider, OAuthFlows };
