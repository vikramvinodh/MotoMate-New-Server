const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertyTypesSchema = new Schema({
    Types: Array,
    created_at: String,
    id: {
        type: String,
        default: "1"
    }
})
const PropertyTypes = mongoose.model("propertyTypes", propertyTypesSchema);
module.exports = PropertyTypes;