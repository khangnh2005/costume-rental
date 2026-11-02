const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
    {
        name: String,
        slug: { 
            type: String, 
            slug: 'name', 
            unique: true 
        },
        parentId: {
            type: String,
            ref: 'Category',
            default: null
        },
        description: String,
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Category =  mongoose.model('Category', categorySchema, 'category'); 

module.exports = Category;