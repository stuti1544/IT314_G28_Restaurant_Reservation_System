const restaurant = require('../model/restaurantmodel');
const mongoose = require('mongoose');

let gfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
});

const isValidTimeRange = (openTime, closeTime) => {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openingMinutes = openHour * 60 + openMinute;
    const closingMinutes = closeHour * 60 + closeMinute;

    // If closing time is smaller than opening time, it means it's past midnight
    // In this case, we add 24 hours (1440 minutes) to the closing time for comparison
    if (closingMinutes < openingMinutes) {
        return (closingMinutes + 1440) > openingMinutes;
    }

    return closingMinutes > openingMinutes;
};

//controller to add Restaurant
const addRestaurant = async (req, res) => {
    try {
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber, foodPreference, features, specialDishes } = req.body;
        if (!req.files.image || !req.files.menuImage) {
            return res.status(400).json({ message: 'Images are required' });
        }
        if (!isValidTimeRange(openingTime, closingTime)) {
            return res.status(400).json({ message: "Invalid Time Range" })
        }
        const newRestaurant = new restaurant({
            ownerId: req.user._id,
            image: req.files.image.map(file => file.filename),
            menuImage: req.files.menuImage.map(file => file.filename),
            name,
            location,
            capacity: JSON.parse(capacity),
            cuisines,
            openingTime,
            closingTime,
            phoneNumber,
            foodPreference,
            features,
            specialDishes
        });
        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
}

const allRestaurant = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const restaurantData = await restaurant.find({ ownerId: ownerId });
        const transformedData = restaurantData.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0]   //considering only first image to display on card
        }));
        res.status(201).json({ restaurantData: transformedData });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message })
    }
}

const GetRestaurantById = async (req, res) => {
    try {
        const id = req.params.id;
        const Restaurant = await restaurant.findById(id);
        if (!Restaurant) {
            return res.status(404).json({ message: "Restaurant Not Found" });
        }
        res.status(200).json({ restaurantData: Restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message })
    }
}

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber, features, specialDishes } = req.body;

        const Restaurant = await restaurant.findOne({ _id: id, ownerId: req.user._id });
        if (!Restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized access' });
        }
        if (name) Restaurant.name = name;
        if (location) Restaurant.location = location;
        if (capacity) Restaurant.capacity = JSON.parse(capacity);
        if (cuisines) {
            Restaurant.cuisines = cuisines
        }

        if (features) {
            Restaurant.features = features
        }
        if (specialDishes) {
            Restaurant.specialDishes = specialDishes
        }
        if (openingTime) Restaurant.openingTime = openingTime;
        if (closingTime) Restaurant.closingTime = closingTime;
        if (phoneNumber) Restaurant.phoneNumber = phoneNumber;
        if (req.files.image) {
            Restaurant.image = req.files.image.map(file => file.filename);
        }
        if (req.files.menuImage) {
            Restaurant.menuImage = req.files.menuImage.map(file => file.filename);
        }
        await Restaurant.save();
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant: Restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
}


module.exports = { addRestaurant, allRestaurant, updateRestaurant,GetRestaurantById };