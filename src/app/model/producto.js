const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
  _id: Schema.ObjectId,
  idProducto: String,
  imagen: String,
  miniatura: String
});



module.exports = mongoose.model('producto', ProductoSchema);
