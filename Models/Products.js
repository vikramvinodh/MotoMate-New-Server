const mongoose = require('mongoose')
const { Schema } = mongoose;

const ProductSchema = new Schema({
    image: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: String,
    },
})
const User = mongoose.model('products_list', ProductSchema);
module.exports = User;