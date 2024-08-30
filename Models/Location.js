// Location Schema
const mongoose = require('mongoose')
const { Schema } = mongoose;

const CitySchema = new Schema({
    country_id: {
        type: String,
    },
    state_id: {
        type: String,
    },
    name: {
        type: String,
    },
    city_slug: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    properties: [{ type: Schema.Types.ObjectId, ref: 'properties_list' }],
    outingPlaces: [{ type: Schema.Types.ObjectId, ref: 'outing_places_list' }],
    testimonials: [{ type: Schema.Types.ObjectId, ref: 'testimonials' }],

});

const StateSchema = new Schema({
    country_id: {
        type: String,
    },
    name: {
        type: String,
    },
    country_name: {
        type: String,
    },
    state_slug: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    properties: [{ type: Schema.Types.ObjectId, ref: 'properties_list' }],
    outingPlaces: [{ type: Schema.Types.ObjectId, ref: 'outing_places_list' }],
    testimonials: [{ type: Schema.Types.ObjectId, ref: 'testimonials' }],
    cities: [CitySchema]
});

const LocationSchema = new Schema({
    country_slug: {
        type: String,
    },
    name: {
        type: String,
        require: true
    },
    currency: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    properties: [{ type: Schema.Types.ObjectId, ref: 'properties_list' }],
    outingPlaces: [{ type: Schema.Types.ObjectId, ref: 'outing_places_list' }],
    testimonials: [{ type: Schema.Types.ObjectId, ref: 'testimonials' }],
    states: [StateSchema]
});

const Location = mongoose.model('location', LocationSchema);
module.exports = Location;
