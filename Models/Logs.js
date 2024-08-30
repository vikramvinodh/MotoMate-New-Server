const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogsSchema = new Schema({
    user: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
});

const Logs = mongoose.model('logs', LogsSchema);
module.exports = Logs;
