'use strict';

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        type: Array,
        default: ['authenticated']
    },
    hashed_password: {
        type: String
    },
    salt: {
        type: String
    }
});

userSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});

userSchema.methods = {
    authenticate: function(text) {
        return this.hashPassword(text) === this.hashed_password;
    },
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },
    hashPassword: function(password) {
        if (!password || !this.salt) {
          return '';
        }
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

userSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('User', userSchema);
