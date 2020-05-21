// Import dependencies
const express = require('express');


var app = express();


// create mongoose model
const Movie = require('../models/movies');


/* GET all movies. */
app.get('/', (req, res) => {
    Movie.find({}, (err, movies) => {
        if (err) res.status(500).send(error)

        res.status(200).json(movies);
    });
});

/* UPDATE movie. */

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Movie.findById(id, (err, movie) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error finding movie',
                errors: err
            });
        }

        if (!movie) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Movie with id ' + id + ' does not exist',
                errors: { message: 'Movie does not exist' }
            });
        }


        movie.titulo = body.titulo;

        movie.save((err, movieSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error on update',
                    errors: err
                });
            }

            res.status(200).json({movie:movieSaved});
        
        });

    });

});

app.get('/find/:search', (req, res) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    var promise = searchMovies(search, regex);

    promise.then(data => {

        res.status(200).json(data);

    })

});

/* Create a bulk movies. */
app.post('/', (req, res) => {
    
    Movie.find({}).lean().exec(
        (err, movies_in_db) => {
            if (err) res.status(500).send(error)
            const titles_in_db = movies_in_db.reduce((a,b)=> a.concat(b.titulo), []);
            const valid_movies = req.body.movies.filter((movie)=> titles_in_db.indexOf(movie.titulo) === -1 );
            
            if(valid_movies.length !== 0){
                Movie.insertMany(valid_movies, (err, docs)=>{
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        console.info('%d movies were successfully stored.', docs.length);
                        res.status(201).json({
                            message:'All movies were successfully stored.'
                        });
                    }
                });
            }else{
                res.status(200).json({
                    message:'All movies exist.'
                });
            }
        }
    );
});

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Movie.findByIdAndRemove(id, (err, movieDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al intentar eliminar',
                errors: err
            });
        }

        if (!movieDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una pelicula con ese id',
                errors: { message: 'No existe una pelicula con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            movie: movieDeleted
        });

    });

});


function searchMovies(search, regex) {
    return new Promise((resolve, reject) => {
        Movie.find({})
            .or([{ 'titulo': regex }, { 'año': regex }, { 'actores': regex }, { 'director': regex }, { 'genero': regex }])
            .exec((err, movies) => {

                if (err) {
                    reject('Error on load movies', err);
                } else {
                    resolve(movies)
                }
            });
    });
}

module.exports = app;