const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { Booking } = require('../models');
const CrudRepository = require('./crud-repository');
const {Enums} = require('../utils/common');
const { CANCELLED, BOOKED } = Enums.Booking_Status;
const AppError = require('../utils/errors/app-errors');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    } 

    async getBooking(data, transaction){
        const response = await  Booking.findByPk(data, {transaction : transaction});
        
        if(!response){
            throw new AppError(`Not Able to find Booking`,StatusCodes.NOT_FOUND);
        }

        return response;
    }

    async updateBooking(id, data, transaction){
        const response = await Booking.update(data, 
            {
                where : {
                    id : id
                }
            },
            {transaction : transaction}
        );
        
        return response;

    }
    
    async cancelOldBookings(timeStamp){
        const response = await Booking.update({ status : CANCELLED }, {
            where : {
                [Op.and] : [
                    {
                        createdAt : {
                            [Op.lt] : timeStamp
                        }
                    },
                    {
                        status : {
                            [Op.ne] : BOOKED
                        }
                    },
                    {
                        status : {
                            [Op.ne] : CANCELLED
                        }
                    }
                ]
            }
        });
        return response;
    }
};

module.exports = BookingRepository;
