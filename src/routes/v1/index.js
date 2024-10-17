const express  = require('express');
const {infoContoller} = require('../../controllers');
const bookingRoutes = require('./booking-route');

const router = express.Router();

router.get('/info',infoContoller.info);

router.use('/bookings',bookingRoutes);

module.exports = router;