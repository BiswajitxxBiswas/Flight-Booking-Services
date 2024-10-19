const express = require('express');

const {serverConfig,loggerConfig} = require("./config");
const CRON = require('./utils/common/corn-jobs');

const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api',apiRoutes);


app.listen(serverConfig.PORT,()=>{
    console.log(`Server is running on the PORT ${serverConfig.PORT}`);
    CRON();
})

