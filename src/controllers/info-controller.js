const {StatusCodes} = require('http-status-codes');

const info = (req,res)=>{
    return res.status(StatusCodes.OK).json({
        success : "Yes",
        message : "API is working well Biswajit",
        error : {},
        data : {}
    });
};

module.exports = {
    info
}