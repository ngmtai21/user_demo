const crypto = require('crypto');

const secret = 'my-key';

exports.md5 = (content) => {
	return crypto.createHmac('sha256', secret)
	.update(content)
	.digest('hex');
};