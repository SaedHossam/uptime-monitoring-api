const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
    // User Id
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // name - The name of the check.
    name: {
        type: String,
        required: true,
    },
    // url - The URL to be monitored.
    url: {
        type: String,
        required: true,
    },
    // protocol - The resource protocol name HTTP, HTTPS, or TCP.
    protocol: {
        type: String,
        required: true,
    },
    // path - A specific path to be monitored (optional).
    path: {
        type: String,
        required: false,
    },
    // port - The server port number (optional).
    port: {
        type: Number,
        required: false,
    },
    // webhook - A webhook URL to receive a notification on (optional).
    webhook: {
        type: String,
        required: false,
    },
    // timeout (defaults to 5 seconds) - The timeout of the polling request (optional).
    timeout: {
        type: Number,
        required: false,
        default: 5 * 1000
    },
    // interval (defaults to 10 minutes) - The time interval for polling requests (optional).
    interval: {
        type: Number,
        required: false,
        default: 10 * 60 * 1000
    },
    // threshold (defaults to 1 failure) - The threshold of failed requests that will create an alert (optional).
    threshold: {
        type: Number,
        default: 1
    },
    remaining_threshold: {
        type: Number,
        default: 1
    },
    // authentication - An HTTP authentication header, with the Basic scheme, to be sent with the polling request (optional).
    authentication: {
        required: false,
        username: {
            type: String
        },
        password: {
            type: String
        },
    },
    // httpHeaders - A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
    httpHeaders: {
        type: [mongoose.Schema.Types.Mixed],
        required: false,
        default: []
    },
    // assert - The response assertion to be used on the polling response (optional).
    assert: {
        statusCode: {
            type: Number
        },
        required: false,
    },
    // tags - A list of the check tags (optional).
    tags: {
        type: [String],
        required: false,
        default: []
    },
    // ignoreSSL - A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
    ignoreSSL: {
        type: Boolean,
        required: true,
    },
    paused:{
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: ""
    }
    /* deleted: {
        type: Boolean,
        default: false
    } */
});


module.exports = mongoose.model('Check', checkSchema);


