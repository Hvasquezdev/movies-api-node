const express = require('express');
const MoviesService = require('../services/movies');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  // GET all the movies
  router.get('/', async function(req, res, next) {
    const { tags } = req.query;

    try {
      const movies = await moviesService.getMovies({ tags });

      res.status(200).json({
        data: movies,
        message:'Movies listed'
      });
    } catch (error) {
      next(error);
    }
  });

  // GET a movie by id
  router.get('/:movieId', async function(req, res, next) {
    const { movieId } = req.params;

    try {
      const movie = await moviesService.getMovie({ movieId });

      res.status(200).json({
        data: movie,
        message:'Movie listed'
      });
    } catch (error) {
      next(error);
    }
  });

  // CREATE a new movie
  router.post('/', async function(req, res, next) {
    const { body: movie } = req;

    try {
      const createdMovieId = await moviesService.createMovie({ movie });

      console.log(createdMovieId);

      res.status(201).json({
        data: createdMovieId,
        message:'Movie created'
      });
    } catch (error) {
      next(error);
    }
  });

  // EDIT an exist movie
  router.put('/:movieId', async function(req, res, next) {
    const { movieId } = req.params;
    const { body: movie } = req;

    try {
      const updatedMovieId = await moviesService.updateMovie({ movieId, movie });

      res.status(200).json({
        data: updatedMovieId,
        message:'Movie updated'
      });
    } catch (error) {
      next(error);
    }
  });

  // EDELETE a movie
  router.delete('/:movieId', async function(req, res, next) {
    const { movieId } = req.params;

    try {
      const deletedMovieId = await moviesService.deleteMovie({ movieId });

      res.status(200).json({
        data: deletedMovieId,
        message:'Movie deleted'
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = moviesApi;