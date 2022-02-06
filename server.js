
// *************************** require libraries ********************************
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const axios   = require('axios');
const pg      = require('pg');
const fav_data = require('./MovieData/data.json');


// ***************************       Variables    ********************************

const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;

// ***************************       call server  ********************************

const server = express();
server.use(cors());
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
// const client = new pg.Client(process.env.DATABASE_URL);
server.use(express.json());

// ***************************    Points Request  ********************************

// GET
server.get('/trending' , handelGetTrnding );
server.get('/search' , handelGetSearch);
server.get('/getMovie/:id' , getSpecifcMovieHandler)
//POSt
server.post('/addMovie' , addMovieHandler);
server.get('/getMovies' , getMovieHandler);
//DELETE
server.delete('/DELETE/:id' , deleteHandler);
//PUT
server.put('/UPDATE/:id' , updateHandler);
//error handler
server.get('*',notFoundHandler);
server.use(errorHandler);

// ***************************    constructor     ********************************

function Movi(id , title, release_date , poster_path, overview) {
    this.id = id ;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

// ***************************       functions  ********************************

let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`

// /trending Function
function handelGetTrnding(req , res){
    let newArr = [];
    axios.get(url)
    .then((result) => {
        result.data.results.forEach((result) => {
            newArr.push(new Movi(result.id , result.title, result.release_date, result.poster_path , result.overview));
        })
        res.status(200).json(newArr);
    })
    .catch((error) => {
        errorHandler(error , req , res);
    });
}

// /search function
let movi_fav = 'The%20Marksman';
function handelGetSearch(req , res){
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&id=756403&query=${movi_fav}`;
    axios.get(url)
    .then(result => {
        let movies = result.data.results.map(movie => {
            return new Movi(movie.id, movie.title, movie.release_date , movie.poster_path, movie.overview);
        });
        res.status(200).json(movies);
    }).catch((error)=>{
                errorHandler(error , req , res);
    })
}

// * function
function notFoundHandler(req,res){
    res.status(404).send("This page is not found")
}

// 500 error function
function errorHandler(error , req , res){
    const err =   {
        status:500 ,
        message : error
        }
    res.status(500).send(err);
}

// /addMovie function
function addMovieHandler(req , res){
    const obj = req.body;
    let sql = `INSERT INTO addmovies(title, release_date, poster_path, overview) VALUES($1,$2,$3,$4) RETURNING *;`
    let values = [obj.title, obj.release_date, obj.poster_path, obj.overview];
    client.query(sql, values).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error =>{
        errorHandler(error , req , res);
    });
}

// /getMovies function
function getMovieHandler(req , res){
    let sql = `SELECT * FROM addmovies;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error =>{
        errorHandler(error , req , res);
    })
}

// /DELETE function
function deleteHandler(req , res){
    const id_params = req.params.id;
    const sql =`    DELETE FROM addmovies WHERE id=$1 RETURNING *;`;
    let values = [id_params];
    client.query(sql, values).then(() =>{
        res.status(200).json(data.rows);
    }).catch(error =>{
        errorHandler(error , req , res);
    });
}

// /UPDATE function
function updateHandler(req , res){
    const id_params = req.params.id;
    const body_value = req.body;
    const sql = `UPDATE addmovies SET title=$1 ,release_date=$2 ,poster_path=$3 ,overview=$4 WHERE id=$5 RETURNING *;`
    let values = [body_value.title, body_value.release_date, body_value.poster_path, body_value.overview, id_params];
    client.query(sql, values).then(data =>{
        res.status(200).json(data.rows);
    }).catch(error =>{
        errorHandler(error , req , res);
    });
}

// /getMovie
function getSpecifcMovieHandler(req , res){
    const id_params = req.params.id;
    const sql = `SELECT * FROM addmovies WHERE id = $1;`;
    let values = [id_params];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res);
    });
}

// ***************************    server listen     ********************************

client.connect().then(()=>{
    //server listen
    server.listen(PORT , ()=>{
    console.log(`listen is start ${PORT}`);
    })
})