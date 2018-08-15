const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
    },
    email: {
    	type: String,
    },
    password: {
        type: String
    },
    createAt: {
    	type: Date,
    	default: Date.now
    }
});

const UserModel = mongoose.model('users', UserSchema);

exports.getOne = (condition) => {
	return UserModel.findOne(condition).exec();
};

exports.checkExists = (username, email) => {
	return UserModel.findOne({
		$or: [
			{username: username},
			{email: email}
		]
	}).exec();
};

exports.save = (username, email, password) => {
	const aBc = new UserModel({username: username, email: email, password: password});
	return aBc.save();
}

// module.exports = mongoose.model('users', UserSchema);