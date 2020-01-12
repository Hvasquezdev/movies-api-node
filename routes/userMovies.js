const express = require('express');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');
const buildMessage = require('../utils/buildMessage');

const {
  movieIdSchema
} = require('../utils/schemas/movies');
const {
  userIdSchema
} = require('../utils/schemas/users');
const {
  createUserMovieSchema
} = require('../utils/schemas/userMovies');

function userMoviesApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesService();

  // Routes
  router.get('/', validationHandler({
    userId: userIdSchema
  }, 'query'), async function (req, res, next) {
    const {
      userId
    } = req.query;

    try {
      const userMovies = await userMoviesService.getUserMovies({
        userId
      });

      res.status(200).json({
        data: userMovies,
        message: buildMessage('user movie', 'list')
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = userMoviesApi;