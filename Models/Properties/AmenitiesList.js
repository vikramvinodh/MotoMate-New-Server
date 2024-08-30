const mongoose = require('mongoose');
const { Schema } = mongoose;

const amenitiesListSchema = new Schema({
    Types: {
        type: [String], 
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
const AmenitiesList = mongoose.model('AmenitiesList', amenitiesListSchema);
module.exports = AmenitiesList