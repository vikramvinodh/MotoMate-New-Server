const mongoose = require('mongoose')
const { Schema } = mongoose;

const formSchema = new Schema({
    formtype: {
        type: String,
    },
    id: {
        type: String,
    },
    lastName: {
        type: String,
    },
    firstName: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    message: {
        type: String,
    },
    date: {
        type: String
    },
    company: {
        type: String
    },
    designation: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    page: {
        type: String
    },
    includes: {
        type: Array
    },
    source: {
        type: String
    },
    note: [{
        message: {
            type: String,
        },
        timeStamp: {
            type: Date,
        }
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    },
    UpdateAt: {
        type: Date,
    }
});

const Forms = mongoose.model('forms', formSchema);
module.exports = Forms;