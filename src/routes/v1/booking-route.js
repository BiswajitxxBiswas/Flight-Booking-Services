const express = require('express');
const { BookingController,infoContoller} = require('../../controllers');

const router = express.Router();


router.post('/',BookingController.CreateBooking);
router.post('/payments',BookingController.makePayment);

module.exports = router;