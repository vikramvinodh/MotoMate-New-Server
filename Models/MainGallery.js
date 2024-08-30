const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    imagesLink: {
        type: String,
        required: true
    },
    UserUploaded: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    }

});

const Gallery = mongoose.model("MainGallery", ImageSchema);

module.exports = Gallery;