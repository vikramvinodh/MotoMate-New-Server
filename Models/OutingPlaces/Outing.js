const mongoose = require('mongoose');
const { Schema } = mongoose;

const outingSchema = new Schema({
    meta_key: String,
    meta_title: String,
    meta_description: String,
    meta_robots: String,
    page_slug: String,
    bottom_section: Array,
    internal_section: Array,

    banner_section: {
        heading: String,
        description: String,
        points: Array,
        gallery: [String]
    }, 
    page_slug: String,
    package_included: Array,

    testimonials: Array,
    faqs_list: Array,

    property_type: String,
}, {
    timestamps: true,
    indexes: [
        { fields: { _id: 1 } },
        { fields: { page_slug: 1 }, unique: true }
    ]
});

const OutingPlaces = mongoose.model("outing_places_list", outingSchema);

module.exports = OutingPlaces;
