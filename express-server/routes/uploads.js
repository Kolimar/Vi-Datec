const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Movie = require('../models/movies');
const Papa = require('papaparse');
const Multer = require('multer');


app.use(fileUpload());

const upload = Multer({dest:'./uploads'});

function parseFile(req, res, next){
    Movie.find({}).lean().exec(
        (err, movies_in_db) => {
            if (err) res.status(500).send(error)
            const titles_in_db = movies_in_db.reduce((a,b)=> a.concat(b.titulo), []);
            var filePath = req.files.file.data;
            Papa.parse(filePath.toString(),{
                delimiter:';',
                header:true,
                complete:(result)=>{ 
                    const t_csv = result.data.reduce((a,b)=> a.concat(b.titulo), []);
                    const csv_data = result.data.filter((movie, index) => {
                        //Remove duplicates from csv, empty titles and existing movie titles
                        const removed = ( 
                        movie.titulo.trim() !== '' && 
                        titles_in_db.indexOf(movie.titulo) === -1 && 
                        t_csv.indexOf(movie.titulo) === index
                        );
                        return removed;
                    });
                    if(csv_data.length !== 0){
                            Movie.insertMany(csv_data, (err, docs)=>{
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
                            res.status(201).json({
                                message:'All movies were successfully stored.'
                            });
                        }
                    },
                    error:(err, file, inputElem, reason)=>{
                        res.send({
                            success: false,
                            err: err
                        })
                    }
            })
        }
    );

    
}

app.post('/', upload.single('file'), parseFile);


module.exports = app;