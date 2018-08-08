const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: string,
    },
    password: {
        type: string
    }
});

module.exports = mongoose.model('user', UserSchema);