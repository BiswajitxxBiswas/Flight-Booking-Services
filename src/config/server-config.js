const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.PORT); // Add this line

module.exports = {
    PORT: process.env.PORT
};


/* Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology. */



/*Sure, let's break down this code step by step:

const dotenv = require('dotenv');:

This line imports the env module. However, it's a bit unusual since the typical module for handling environment variables in Node.js is dotenv. It might be a custom module in your project or an alias for dotenv.
dotenv.config();:

Assuming env is correctly imported and is a module like dotenv, this line calls the config method from the dotenv package. This method loads environment variables from a .env file into process.env, making them accessible throughout your application.
module.exports = { PORT : process.env.PORT }:

This line exports an object with a single property PORT.
The value of PORT is taken from process.env.PORT. This means the application will look for an environment variable named PORT, which is typically defined in the .env file or set in the environment where the application is running.
In summary, this code snippet is configuring environment variables for your Node.js application. It loads the environment variables from a .env file and then exports an object containing the PORT variable, which can be used elsewhere in your application to access the port number on which your server should run.*/