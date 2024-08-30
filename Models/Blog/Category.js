const mongoose = require('mongoose');
var autoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bottomBlock: {
        type: Array,
    },
    internalBlock: {
        type: Array,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'article'
        }
    ],
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
}, { toJSON: { virtuals: true } },
    {
        strictPopulate: false
    });

CategorySchema.plugin(autoIncrement, { inc_field: 'BlogCategoryid' });

CategorySchema.virtual('article', {
    ref: 'article',
    localField: 'blogs',
    foreignField: '_id'
});

const Category = mongoose.model('blog-categories', CategorySchema);

module.exports = Category;
