const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema({
  meta_key: String,
  meta_title: String,
  meta_description: String,
  meta_robots: String,
  page_slug: String,
  bottom_section: Array,
  internal_section: Array,

  page_slug: String,

  banner_section: {
    heading: String,
    description: String,
    gallery: [String]
  },

  about_section: {
    description: String,
    stats: Array
  },

  suitable_for_list: [{
    image: String,
    title: String,
    description: String,
  }],

  amenities_list:[String],
  

  package_included: Array,

  photo_gallery: [{
    type: String,
  }],

  faqs_list: Array,

  property_type: String,
  testimonials: [{ type: Schema.Types.ObjectId, ref: 'testimonials' }],

}, {
  timestamps: true,
  indexes: [
    { fields: { page_slug: 1 }, unique: true }
  ]
});

const Properties = mongoose.model("properties_list", propertySchema);

module.exports = Properties;
