if (process.env.NODE_ENV !== "production"){
  require("dotenv").config()
}
const dbUrl = process.env.DB_URL

const mongoose = require('mongoose');
mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: :('));
db.once('open', function() {
 console.log('connected to mongoose');
});

const Campground = require("../model/CampSchema")
const cities = require("./cities")
const seedhelpers = require("./seedhelpers")
//or { places, descriptors} = require("./seedhelpers")//

const TitleFunc = seedcall => seedcall[Math.floor(Math.random() * seedcall.length)]

const seedDB = async ()=>{
   await Campground.deleteMany({});
   for ( let i = 0; i <= 350; i++ ){
        const rand1000 = Math.floor(Math.random()*1000);
        const location =  new Campground({
        owner : "62b4e14371680a871eab81f8",
        location : `${cities[rand1000].city},${cities[rand1000].state}`,
        geometry : {
          type : 'Point',
          coordinates : [
            cities[rand1000].longitude,
            cities[rand1000].latitude
          ]
        },
        title : `${TitleFunc(descriptors)} ${TitleFunc(places)}`,
        price : `${rand1000}`,
        image: [
            {
              url: 'https://res.cloudinary.com/da8iuzvkg/image/upload/v1656547400/CAMP%20IMAGES/jwtemvq64pkuctvamrov.jpg',
              filename: 'CAMP IMAGES/jwtemvq64pkuctvamrov',
            },
            {
              url: 'https://res.cloudinary.com/da8iuzvkg/image/upload/v1656547400/CAMP%20IMAGES/pfivbwnwl5zff2fngkot.jpg',
              filename: 'CAMP IMAGES/pfivbwnwl5zff2fngkot',
            }
          ]
        })
        await location.save().then(error => console.log(error))
    }
}
seedDB();