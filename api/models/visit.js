const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    // Check Id
    check_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Check'
    },
    // Up or Down
    status: {
        type: String,
        required: true
    },
    // Start Time
    startTime: {
        type: Date,
        required:true
    },
    // End Time
    endTime: {
        type: Date,
        required:true
    },
    // Duration
    duration: {
        type: Number,
    }
});

module.exports = mongoose.model('Visit', visitSchema);