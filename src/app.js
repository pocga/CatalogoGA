const path = require('path'),
      express = require('express'),
      morgan = require('morgan'),
      mongoose = require('mongoose'),
      errorMW = require('./app/middlewares/error.js')
      dotenv = require('dotenv');



const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_ROUTE)
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));
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

app.use(express.urlencoded({extended: false}))

// routes
app.use('/', indexRoutes);

app.use(errorMW.handle);

//starting the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);  
});

module.exports = app;