
const express = require('express');
const cors = require('cors');
const data = require('./MovieData/data.json');
const APIKEY = '2b7e0d0fc3aa48406f2242c8379da8ed';

const server = express();
server.use(cors());
server.use(express.json());

server.get('/' , handelGet );
server.get('/favorite' , handelGetFav);
server.get('*' , handelGetEror);
server.use(errorHandler);

// ***************************    constructor     ********************************

function Constr(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

// ***************************       functions  ********************************

let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`

function handelGet( req , res){
    let obj = {title: data.title, poster_path: data.poster_path , overview: data.overview};
    return res.status(200).json(obj);
}
function handelGetFav(req , res){
    
    return res.status(200).send("Welcome to Favorite Page");
}

function handelGetEror(req , res){
    return res.status(404).send("Page Not Found Eror 404 ");
}

function errorHandler (error,req,res){
    const err = {
        status : 500,
        messgae : error
    }
    res.status(500).send(err);
}

server.listen(3000 , ()=>{
    console.log("listen is start");
})