export default class AuthClassTest {
	constructor(options?) {
		this.configure(options);

		console.log('CONSTRUCTED');
	}

	configure(config?) {
		console.log('CONFIGURED');
	}
}
