const mongoose = require('mongoose');

UserSchema = mongoose.Schema({
    username : String
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;