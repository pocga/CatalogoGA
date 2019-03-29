const path = require('path');
const express = require('express');
bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv')


const app = express();

dotenv.config();

mongoose.connect('mongodb://localhost/producto')
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));
const indexRoutes = require('./app/routes/index')

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(morgan('development'));
app.use(express.urlencoded({extended: false}))

// routes
app.use('/', indexRoutes);

//starting the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);  
  console.log(process.env.ROOT)
});

module.exports = app;