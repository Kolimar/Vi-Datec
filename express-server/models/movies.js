var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create mongoose schema
const movieSchema = new mongoose.Schema({
    actores: { type: String, required: false },
    año: { type: String, required: false },
    director: { type: String, required: false },
    genero: { type: String, required: false },
    titulo: { type: String, required: [true, 'El titulo de la pelicula es requerido.'] }
});

module.exports = mongoose.model('Movie', movieSchema);