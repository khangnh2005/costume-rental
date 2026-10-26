const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);
const categorySchema = new mongoose.Schema(
    {
        name : String ,
        slug: { type: String, slug: 'name', unique: true },
        description : String ,
        deleted : {
            type : Boolean,
            default : false
        }
    }
);

module.exports = mongoose.model('Category', categorySchema, 'category'); 