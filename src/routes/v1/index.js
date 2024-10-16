const express  = require('express');
const {infoContoller} = require('../../controllers');

const router = express.Router();

router.get('/info',infoContoller.info);


module.exports = router;