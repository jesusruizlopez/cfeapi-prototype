'use strict';

/**
 * Dependencies.
 */

var mongoose = require('mongoose'),
timestamps   = require('mongoose-timestamp'),
Schema       = mongoose.Schema;

/**
 * Schema.
 */

var reportSchema = new Schema({
    status: {
        type: String,
        enum: [
            'submitted',
            'open',
            'attending',
            'waiting',
            'closed'
        ],
        default: 'submitted'
    },
    observations: {
        type: String
    },
    service_number: {
        type: String,
        required: true 
    },
    email: {
        type: String
    },
    twitter: {
        type: String
    },
    failure: {
        type: Schema.Types.ObjectId,
        ref: 'Failure',
        index: true
    },  
    forum: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        index: true
    }
});

/**
 * Functions
 */



/**
 * Validations
 */

reportSchema.pre('save', function ( next ) {
    next();
});

reportSchema.pre('remove', function ( next ) {
    next();
});

/**
 * Methods
 */



/**
 * Statics
 */

reportSchema.statics.load = function ( id, cb ) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};


/**
 * Plugins
 */

reportSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Report', reportSchema);
