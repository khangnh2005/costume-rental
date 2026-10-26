const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);
const costumeSchema = new mongoose.Schema(
    {
        ownerId : {
            type : String ,
            default : ""
        },
        categoryId: String,
        title : String ,
        description : String ,
        deleted : {
            type : Boolean,
            default : false
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
        color : String ,
        quantity : {
           type : Number ,
           min : 0 ,
           default : 0
        },
        image : String , 
        slug: { type: String, slug: 'title', unique: true },
        dailyRentalPrice : {
            type : Number ,
            min : 0
        },
        status : {
            type : String , 
            default : "active"
        }
    },
    {timestamps : true}
);

module.exports = mongoose.model('Costume', costumeSchema, 'costume');