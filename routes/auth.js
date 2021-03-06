const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const THIRTY_DAYS_IN_SEC = 2592000;
const TWO_HOURS_IN_SEC = 7200;

// Services
const ApiKeysService = require('../services/apiKeys');
const UsersService = require('../services/users');

// Utils
const validationHandler = require('../utils/middleware/validationHandler');
const buildMessage = require('../utils/buildMessage');

// Schemas
const {
  createUserSchema
} = require('../utils/schemas/users');

const {
  config
} = require('../config/index');

// Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth/', router);

  const apiKeysService = new ApiKeysService();
  const usersService = new UsersService();

  router.post('/sign-in', async function (req, res, next) {
    const {
      apiKeyToken,
      rememberMe
    } = req.body;
    if (!apiKeyToken) {
      return next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function (err, user) {
      try {
        if (err || !user) {
          return next(boom.unauthorized());
        }

        req.login(user, {
          session: false
        }, async function (error) {
          if (error) {
            return next(error);
          }

          const apiKey = await apiKeysService.getApiKey({
            token: apiKeyToken
          });

          if (!apiKey) {
            return next(boom.unauthorized());
          }

          const {
            _id: id,
            name,
            email
          } = user;
          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes
          };
          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
          });

          res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev,
            maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
          });

          return res.status(200).json({
            token,
            user: {
              id,
              name,
              email
            }
          });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

  router.post('/sign-up', validationHandler(createUserSchema), async function (req, res, next) {
    const {
      body: user
    } = req;

    try {
      const userExist = await usersService.verifyIfUserExist(user);

      if (userExist) {
        return res.status(409).json({
          message: 'user already exist'
        });
      }

      const createdUserId = await usersService.createUser({
        user
      });

      res.status(201).json({
        data: createdUserId,
        message: buildMessage('user', 'create')
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = authApi;