const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServiceMock } = require('../utils/mocks/movies');
const testServer = require('../utils/testServer');

describe('routes - movies', function() {
  const route = proxyquire('../routes/movies', {
    '../services/movies': MoviesServiceMock
  });

  const request = testServer(route);
  describe('GET /movies', function() {
    it('should response with status 200', function(done) {
      request.get('/api/movies').expect(200, done);
    });

    it('should respond with the list of movies', function(done) {
      request.get('/api/movies').end((err, res) => {
        assert.deepEqual(res.body, {
          data: moviesMock,
          message: 'movies listed'
        });

        done();
      });
    })
  });

  describe('GET /:movieId', function() {
    const movieId = '60be5e14-3396-4ab8-ae5b-2906fde9f2cb';

    it('should response with status 200 when get an especific movie', function(done) {
      request.get(`/api/movies/${movieId}`).expect(200, done);
    });

    it('should respond with an especific movie', function(done) {
      request.get(`/api/movies/${movieId}`).end((err, res) => {
        assert.deepEqual(res.body, {
          data: moviesMock[0],
          message: 'movie retreived'
        });

        done();
      });
    })
  });
});