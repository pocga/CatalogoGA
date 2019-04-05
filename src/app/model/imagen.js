const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImagenesSchema = Schema({
    _id: Schema.ObjectId,
    nombre: String,
    imagen: String

});

module.exports = mongoose.model('imagenes', ImagenesSchema, 'imagenes');