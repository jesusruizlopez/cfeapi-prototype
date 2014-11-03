'use strict';

var mongoose = require('mongoose'),
    timestamps   = require('mongoose-timestamp'),
    Schema       = mongoose.Schema;

var forumSchema = new Schema({
    failure:{
        type: String
    },
    status: {
        type: String,
        enum: [
            'open',
            'attending',
            'waiting',
            'closed'
        ],
        default: 'open'
    },
    comments: [{
        author: {
            type: String
        },
        comment:{
            type: String
        }
    }],
    reports: [{
        id: {
            type: String
        },
        service_number: {
            type: String
        }
    }]
});

forumSchema.statics.load = function ( id, cb ) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

forumSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Forum', forumSchema);
