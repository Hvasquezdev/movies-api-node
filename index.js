const express = require('express');
const app = express();

// Config
const {
  config
} = require('./config/index');

// Routes
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');
const authApi = require('./routes/auth');

// Error Handlers
const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');

app.use(express.json());

// Routes
moviesApi(app);
userMoviesApi(app);
authApi(app);

// Catch 404 error
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});