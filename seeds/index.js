const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for( let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
     const camp =  new Campground({
        author: '5ffcb237b7322d23a0475a5f',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: ' Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero',
        price,
        geometry: {
            type: "Point",
            coordinates: [cities[random1000].longitude,
                         cities[random1000].latitude
            ]
        },
        images : [
            {
        "url" : "https://res.cloudinary.com/dquiwka6j/image/upload/v1610654379/Yelpcamp/iuahu8b2hy2uf6lzpam8.jpg", 
        "filename" : "Yelpcamp/iuahu8b2hy2uf6lzpam8"
         } 
    ] 
     

    })
    await camp.save()
    }
    
}


seedDB().then(() => {
    mongoose.connection.close()
})