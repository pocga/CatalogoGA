const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
  _id: Schema.ObjectId,
  id: String,
  url_small_img: String,
  url_full_img: String
});



module.exports = mongoose.model('producto', ProductoSchema);
