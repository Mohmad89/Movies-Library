DROP TABLE IF EXISTS AddMovies;

CREATE TABLE IF NOT EXISTS AddMovies(
    id SERIAL PRIMARY KEY ,
    title VARCHAR(255) , 
    release_date VARCHAR(255) ,
    poster_path VARCHAR(255) ,
    overview VARCHAR(255) 
);