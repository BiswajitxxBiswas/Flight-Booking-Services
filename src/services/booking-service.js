const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { serverConfig } = require('../config');

const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/app-errors');
const db = require('../models');
const { Enums } = require('../utils/common');
const { CANCELLED, BOOKED } = Enums.Booking_Status;

const bookingRepository = new BookingRepository();

async function CreateBooking(data){

    const transaction = await db.sequelize.transaction();

    try {
            
            const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;

            if(data.noOfSeats > flightData.totalSeats ){
               throw new AppError('Not Enough Seats Available', StatusCodes.BAD_REQUEST);
            }

            const totalBillingCost = data.noOfSeats * flightData.price ;
            const bookingPayload = {...data, totalCost : totalBillingCost };
            const booking = await bookingRepository.createBooking( bookingPayload, transaction );

            await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
                {
                    seats : data.noOfSeats
                });

            await transaction.commit();
            return booking;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();

    try {

        const bookingDetails = await bookingRepository.getBooking(data.bookingId, transaction);
        
        if( bookingDetails.status == CANCELLED ){
            throw new AppError(`The Booking has Expired`,StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();

        if(currentTime  - bookingTime > 300000 ){

            await cancelBooking(data.bookingId);
            throw new AppError(`Session Has Expired`,StatusCodes.BAD_REQUEST);
        }

        if(data.totalCost != bookingDetails.totalCost ){
            await bookingRepository.updateBooking(data.bookingId,{status : CANCELLED}, transaction);
            throw new AppError(`The Amount of Payment Does Not Match`,StatusCodes.BAD_REQUEST);
        }

        if(data.userId != bookingDetails.userId ){
            await bookingRepository.updateBooking(data.bookingId,{status : CANCELLED}, transaction);
            throw new AppError(`The userId of corresponding User Does Not Match`,StatusCodes.BAD_REQUEST);
        }

        await bookingRepository.updateBooking(data.bookingId, {status : BOOKED}, transaction);
        
        await transaction.commit();
        
        return bookingDetails;
        
    } catch (error) {
        await transaction.rollback();
        return error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.getBooking(bookingId, transaction);

        if(bookingDetails.status == CANCELLED ){
            await transaction.commit();
            return true;
        }

        axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            seats : bookingDetails.noOfSeats,
            dec : 0
        });

        await bookingRepository.updateBooking(bookingId, { status : CANCELLED }, transaction);

        await transaction.commit();


    } catch (error) {
        await transaction.rollback();
        return error;
    }
}
    
module.exports = {
    CreateBooking,
    makePayment
}