
const express = require('express');
const cors = require('cors');
const fav_data = require('./MovieData/data.json');

const server = express();
server.unsubscribe(cors());

server.get('/' , handelGet );
server.get('/favorite' , handelGetFav);
server.get('*' , handelGetEror);

function constr(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function handelGet( requ , resp){
    return resp.status(200).send("Empty page");
}
function handelGetFav(req , res){
    let data = fav_data.data.map(val =>{
        return new constr(val.title , val.poster_path , val.overview);
    });
    res.status(200).json(data);
}

function handelGetEror(req , res){
    return res.status(404).send("Page Not Found Eror 404 ");
}

server.listen(3000 , ()=>{
    console.log("listen is start");
})