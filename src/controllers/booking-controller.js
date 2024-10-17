const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { BookingService } = require('../services');

async function CreateBooking(req,res) {
    try {
        const airplane = await BookingService.CreateBooking({
            flightId : req.body.flightId,
            noOfSeats : req.body.noOfSeats,
            userId : req.body.userId
        });
        // console.log('Inside Controller Succ',airplane);
        SuccessResponse.data = airplane;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        // console.log(`Error in Controller`,error);
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    CreateBooking 
}