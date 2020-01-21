const express = require('express');
const passport = require('passport');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');
const buildMessage = require('../utils/buildMessage');

const {
  userIdSchema
} = require('../utils/schemas/users');
const {
  createUserMovieSchema,
  userMovieIdSchema
} = require('../utils/schemas/userMovies');

// JWT strategy
require('../utils/auth/strategies/jwt');

function userMoviesApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesService();

  // Routes
  router.get('/', passport.authenticate('jwt', {
    session: false
  }), validationHandler({
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

  router.post('/', passport.authenticate('jwt', {
    session: false
  }), validationHandler(createUserMovieSchema), async function (req, res, next) {
    const {
      body: userMovie
    } = req;

    try {
      const createdUserMovieId = await userMoviesService.createUserMovie({
        userMovie
      });

      res.status(201).json({
        data: createdUserMovieId,
        message: buildMessage('user movie', 'create')
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:userMovieId', passport.authenticate('jwt', {
    session: false
  }), validationHandler({
    userMovieId: userMovieIdSchema
  }, 'params'), async function (req, res, next) {
    const {
      userMovieId
    } = req.params;

    try {
      const deletedUserMovieId = await userMoviesService.deleteUserMovie({
        userMovieId
      });

      res.status(200).json({
        data: deletedUserMovieId,
        message: buildMessage('user movie', 'delete')
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = userMoviesApi;