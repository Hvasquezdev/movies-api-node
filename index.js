const express = require('express');
const app = express();

const {
  config
} = require('./config/index');
const moviesApp = require('./routes/movies');
const {
  logErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers');

app.use(express.json());

moviesApp(app);

app.use(logErrors);
app.use(errorHandler);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});