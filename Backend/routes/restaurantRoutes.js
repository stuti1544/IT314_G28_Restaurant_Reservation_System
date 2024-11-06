const express = require('express');
const router = express.Router();
const validatetoken = require('../middleware/validatetoken');
const restaurantController = require('../controllers/restaurantController');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
require('dotenv').config();
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.createConnection(process.env.MONGO_URI);

let gfs, gridfsBucket;

conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });


    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

//storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: {
        useUnifiedTopology: true
    },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// Routes
router.post(
    '/addRestaurant',
    validatetoken,
    upload.fields([{ name: 'image' }, { name: 'menuImage' }]),
    restaurantController.addRestaurant
);

router.put(
    '/updateRestaurant/:id',
    validatetoken,
    upload.fields([{ name: 'image' }, { name: 'menuImage' }]),
    restaurantController.updateRestaurant
);

router.get('/allRestaurant', validatetoken, restaurantController.allRestaurant);
router.delete('/delete/:id', validatetoken, restaurantController.deleteRestaurant);
router.get('/searchRestaurant', validatetoken, restaurantController.searchRestaurant);
router.get('/:id',validatetoken,restaurantController.GetRestaurantById)

router.get('/images/:filename', async (req, res) => {
    const { filename } = req.params;
    const file = await gfs.files.findOne({ filename: filename });
    const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
    readstream.pipe(res);
});

module.exports = router;