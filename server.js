
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const fav_data = require('./MovieData/data.json');

const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;

const server = express();
server.use(cors());

server.get('/trending' , handelGetTrnding );
server.get('/search' , handelGetSearch);
server.use('*',notFoundHandler);
server.use(errorHandler);

function Movi(id , title, release_date , poster_path, overview) {
    this.id = id ;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`

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

function notFoundHandler(req,res){
   res.status(404).send("This page is not found")
}
function errorHandler(error , req , res){
    const err =   {
        status:500 , 
        message : error
        }
    res.status(500).send(err);
}

//server listen
server.listen(PORT , ()=>{
    console.log("listen is start");
})
