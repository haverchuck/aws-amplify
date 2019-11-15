'use strict';

if (process.env.NODE_ENV === 'production') {
	module.exports = require('./dist/aws-amplify-auth2.min.js');
} else {
	module.exports = require('./dist/aws-amplify-auth2.js');
}
