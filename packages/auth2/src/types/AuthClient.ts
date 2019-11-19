interface IAuthClient {
	clientParameters: any;
	defaultHeaders: any;
	defaultOptions: any;
	endpoint: string;
	name: string;
	urlListener?: UrlListener;
	signIn: (signInParams: any) => Promise<any>;
}

type UrlListener = {
	onLoad: Function;
};

export { IAuthClient, UrlListener };
