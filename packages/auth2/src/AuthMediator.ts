import { IAuthClient } from './types';

const selectClient = (
	defaultClient: IAuthClient,
	manualClient?: IAuthClient
) => {
	if (manualClient) {
		return manualClient;
	} else {
		return defaultClient;
	}
};

export { selectClient };
