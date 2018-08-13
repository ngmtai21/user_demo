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

module.exports = mongoose.model('users', UserSchema);