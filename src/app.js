const path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    errorMW = require('./app/middlewares/error.js'),
    logger = require('./app/logger/logger'),
    cors = require('cors'),
    dotenv = require('dotenv');

const app = express();

dotenv.config();

const indexRoutes = require('./app/routes/index')

//settings
app.set('port', process.env.PORT);

//middlewares
morgan.token('req-params', req => req.params);
app.use(
    morgan(
        '[:date[clf]] :remote-addr - Request ":method :url" with params: :req-params. Response status: :status.'
    )
);
app.use(cors())
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/', indexRoutes);
app.use(errorMW.handle);

//starting the server
app.listen(app.get('port'), () => {
    logger.info(`server on port ${app.get('port')}`);
});

module.exports  =  app;