const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    // Check Id
    check_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Check'
    },
    // status - The current status of the URL. Up or Down
    status: {
        type: String,
        required: true,
    },
    // availability - A percentage of the URL availability.
    availability: {
        type: Number,
        required: true,
    },
    // outages - The total number of URL downtimes.
    outages: {
        type: Number,
        required: true,
    },
    // downtime - The total time, in seconds, of the URL downtime.
    downtime: {
        type: Number,
        required: true,
    },
    // uptime - The total time, in seconds, of the URL uptime.
    uptime: {
        type: Number,
        required: true,
    },
    // responseTime - The average response time for the URL.
    responseTime: {
        type: Number,
        required: true,
    },
    // history - Timestamped logs of the polling requests.
    /* history: {
        type: [],
        required: true,
        default: []
    } */
})

module.exports = mongoose.model('Report', reportSchema);