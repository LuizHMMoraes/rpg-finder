
const mongoose = require('mongoose');
const RpgGroup = require('../models/rpgGroup');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/rpg-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("database connected:");
})

const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await RpgGroup.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const group = new RpgGroup({
            author: '65219aae81b8dbb35ea8c71b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto libero inventore, consequatur harum, itaque sunt fugiat assumenda delectus odit quam dicta fugit possimus est optio dolores eum, provident laboriosam eos?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/djxomm4es/image/upload/v1696780110/Rpg%20Finder/istockphoto-1181398275-170667a_pt5fmi.webp',
                    filename: 'Rpg Finder/istockphoto-1181398275-170667a_pt5fmi'
                    // url: 'https://res.cloudinary.com/djxomm4es/image/upload/v1690486784/Yelp%20Camp/y4pvj5rvsfkapusqux6c.jpg',
                    // filename: 'Rpg Finder/istockphoto-1181398275-170667a_pt5fmi'
                }
            ]
        });
        await group.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});