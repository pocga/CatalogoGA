const path = require('path'),
      express = require('express'),
      morgan = require('morgan'),
      mongoose = require('mongoose'),
      dotenv = require('dotenv');


const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_ROUTE)
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));
const indexRoutes = require('./app/routes/index')

//settings
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(morgan(process.env.MOR_DEV));
app.use(express.urlencoded({extended: false}))

// routes
app.use('/', indexRoutes);

//starting the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);  
});

module.exports = app;