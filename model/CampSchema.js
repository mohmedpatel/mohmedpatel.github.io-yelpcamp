const mongoose = require('mongoose');
const Review = require('../model/reviewSchema')
const schema = mongoose.Schema;

const ImageSchema = new schema({
    url : String,
    filename : String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload/', '/upload/w_100,h_50/')
})

const CampSchema = new schema({
    title : String,
    price : Number,
    description : String,
    location : String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    image : [ImageSchema],
    owner : {
        type : schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [{
        type : schema.Types.ObjectId,
        ref : 'Review'
    }]
}, {toJSON: { virtuals: true }}
)

CampSchema.virtual('properties.popUp').get(function(){
    return `<center><a href="/campground/${this._id}"> ${this.title} </a><br>
            <b>${this.location}</b></center>`
})

CampSchema.post("findOneAndDelete", async function(data){
    if(data){
        const del = await Review.deleteMany({_id : {$in : data.reviews}})
        console.log(del)
    }
    
})

const Campground = mongoose.model("Campground", CampSchema)

module.exports = Campground
