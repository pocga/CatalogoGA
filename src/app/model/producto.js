const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
    _id: Schema.ObjectId,
    idProducto: Number,
    imagen: String,
    miniatura: String
});

module.exports = mongoose.model('producto', ProductoSchema);