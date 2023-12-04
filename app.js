const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const databasePath = path.join(__dirname, "moviesData.db");

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const objectTOResponseObject = (dbobject) => {
  return {
    movie_id: bdobject.movie_id,
    director_id: dbobject.director_id,
    movie_name: dbobject.movie_name,
    lead_actor: dbobject.lead_actor,
  };
};
app.get("/movies/", async (Request, Response) => {
  const getMovieName = `
    SELECT movie_name
    FROM
    movie`;
  const moviearray = await database.all(getMovieName);
  Response.send(moviearray);
});

app.post("/movies/", async (Request, Response) => {
  const { director_id, movie_name, lead_actor } = Request.body;
  const postmoivesquery = `
    INSERT INTO
    movie (director_id, movie_name, lead_actor)
  VALUES
    ('${director_id}', ${movie_name}, '${lead_actor}');`;
  const postmoivesarray = await database.run(postmoivesquery);
  Response.send("Movie Successfully Added");
});

//api 3
app.get("/movies/:movieId/", async (Request, Response) => {
  const { movie_id } = Request.body;
  const getmoviequery = `
    SELECT 
     *  
     FROM
     movie
     WHERE
     movie_id = '${movie_id}';`;
  const movie = await database.run(getmoviequery);
  Response.send(objectTOResponseObject(movie));
});

app.put("/movies/:movieId/", async (Request, Response) => {
  const { directorId, movieName, leadActor } = Request.body;
  const { movieId } = Request.params;
  const updatePlayerQuery = `
  UPDATE
    movie
  SET
    director_id = '${director_id}',
    movie_name = ${movie_name},
    lead_actor = '${lead_actor}'
  WHERE
    director_id = ${directorid};`;

  await database.run(updatePlayerQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (Request, Response) => {
  const { director_id } = Request.params;
  const deletequery = `
    DELETE FROM
    movie
    WHERE
    director_id = '${director_id}';
    `;
  await database.run(deletequery);
  Response.send("Movie Removed");
});

app.get("/directors/", async (Request, Response) => {
  const getquery = `
  SELECT
  *
  FROM
  director;`;
  const directorarray = await database.all(getquery);
  Response.send(directorarray);
});

app.get("/director/:directorId/movies/", async (Request, Response) => {
  const { director_id } = Request.params;
  const getdirectorMovieQuery = `
    SELECT
    *
    FROM
    director
    WHERE
    director_id = '${director_id}';`;
  const getdirectorMoviearray = await database.run(getdirectorMovieQuery);
  Response.send(getdirectorMoviearray);
});

module.exports = app;
