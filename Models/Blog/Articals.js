const mongoose = require('mongoose');
var autoIncrement = require('mongoose-sequence')(mongoose);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    readTime: {
        type: String,
        required: true,
    },
    interested: {
        type: String,
        required: true,
    },
    view: {
        type: String,
        required: true,
    },
    smalldesc: {
        type: String,
        required: true,
    },
    share: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog-authors'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog-categories'
    },
    faqs: {
        type: Array,
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    },
    bottom_section: {
        type: Array
    },
    internal_section: {
        type: Array
    },
    meta_key: {
        type: String
    },
    meta_title: {
        type: String
    },
    meta_description: {
        type: String
    },
    meta_robots: {
        type: String
    },
},
    {
        strictPopulate: false
    });

articleSchema.plugin(autoIncrement, { inc_field: 'BlogArticleid' });

const Article = mongoose.model('article', articleSchema);

module.exports = Article;
