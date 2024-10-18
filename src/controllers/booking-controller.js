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
        SuccessResponse.data = airplane;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function makePayment(req,res) {
    try {
        const response = await BookingService.makePayment({
            bookingId : req.body.bookingId,
            userId : req.body.userId,
            totalCost : req.body.totalCost
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    CreateBooking,
    makePayment
}