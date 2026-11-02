const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const costumeSchema = new mongoose.Schema(
    {
        ownerId: {
            type: String,
            default: ""
        },
        categoryId: {
            type: String,
            ref: 'Category',
            default: null
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        deleted: {
            type: Boolean,
            default: false
        },
        sizes: [
            {
                sizeId: String,
                quantity: {
                    type: Number,
                    min: 0,
                    default: 1
                }
            }
        ],
        color: {
            type: String,
            default: ""
        },
        quantity: {
            type: Number,
            min: 0,
            default: 0
        },
        images: {
            type: [String],
            default: []
        }, 
        slug: { 
            type: String, 
            slug: 'title', 
            unique: true 
        },
        dailyRentalPrice: {
            type: Number,
            min: 0,
            default: 0
        },
        status: {
            type: String, 
            default: "active"
        }
    },
    { timestamps: true }
);

const Costume =  mongoose.model('Costume', costumeSchema, 'costume');

module.exports = Costume;