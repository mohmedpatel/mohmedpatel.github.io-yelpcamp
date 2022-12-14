const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment : String,
    rating : Number,
    owner : {
        type : schema.Types.ObjectId,
        ref : 'User'
    },
})

const Review = mongoose.model('Review', reviewSchema) 

module.exports = Review