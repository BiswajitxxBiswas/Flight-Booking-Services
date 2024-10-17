const express = require('express');
const { BookingController,infoContoller} = require('../../controllers');

const router = express.Router();


router.post('/',BookingController.CreateBooking);

module.exports = router;