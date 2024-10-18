const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { serverConfig } = require('../config');

const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/app-errors');
const db = require('../models');

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

    
module.exports = {
    CreateBooking
}