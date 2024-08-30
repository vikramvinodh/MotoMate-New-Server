const mongoose = require('mongoose')
const { Schema } = mongoose;

const TestimonialsSchema = new Schema({

    title: {
        type: String,
        unique: false
    },
    name: {
        type: String,
        unique: false
    },
    comment: {
        type: String,
        unique: false
    },
    rating: {
        type: Number,
        unique: false
    },
    photo:{
        type:String,
        unique: false
    },
    propertyType: {
        type:String,
        unique: false
    },
    property:{
        type: Schema.Types.ObjectId,
        ref: 'properties'
    },
    location:{
        type: Schema.Types.ObjectId,
        ref: 'location'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: String,
        unique: false
    },
    UserCreated: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    UserUpdated: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
})

const testimonials = mongoose.model('testimonials', TestimonialsSchema);
module.exports = testimonials;