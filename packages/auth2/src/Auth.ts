export default class AuthClassTest {
	private _configured: boolean = false;

	constructor(options?) {
		if (!this._configured) {
			this.configure(options);
		}

		console.log('CONSTRUCTED');
	}

	configure(config?) {
		console.log('CONFIGURED');
		this._configured = true;
	}
}
