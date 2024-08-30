const mongoose = require('mongoose');
const { Schema } = mongoose;

const outingSchema = new Schema({
    // Seo Content
    meta_key: {
        type: String,
    },
    meta_title: {
        type: String,
    },
    meta_description: {
        type: String,
    },
    meta_robots: {
        type: String,
    },
    bottom_section: {
        type: Schema.Types.Mixed,
    },
    internal_section: {
        type: Schema.Types.Mixed,
    },
    // Seo Content

    // Page Requirement
    banner_title: {
        type: String,
        trim: true,
    },
    overview: {
        type: String,
        trim: true,
    },
    page_slug: {
        type: String,
        trim: true,
    },
    expect: {
        type: String,
        trim: true,
    },
    activities_included: [{
        type: String,
        trim: true,
    }],
    benefits: [{
        type: String,
        trim: true,
    }],
    photo_gallery: [{
        type: String,
    }],
    // Page Requirement

}, {
    timestamps: true,
    indexes: [
        { fields: { _id: 1 } },
        { fields: { page_slug: 1 }, unique: true }
    ]
});

const OutingPlaces = mongoose.model('OutingPlaces', outingSchema);

module.exports = OutingPlaces;
