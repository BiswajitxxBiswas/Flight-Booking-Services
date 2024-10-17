const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { serverConfig } = require('../config');

const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/app-errors');
const db = require('../models');

async function CreateBooking(data){

    return new Promise((resolve, reject) => {
        const result = db.sequelize.transaction(async function bookingImpl(t) {
            
            const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;

            if(data.noOfSeats > flightData.totalSeats ){
                reject(new AppError('Not Enough Seats', StatusCodes.BAD_REQUEST));
            }

            resolve(true);

        });

    });
        
} 

module.exports = {
    CreateBooking
}