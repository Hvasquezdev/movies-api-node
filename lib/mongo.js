const {
  MongoClient,
  ObjectId
} = require('mongodb');
const {
  config
} = require('../config/index');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;
const PORT = config.port;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}:${PORT}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if(!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if(err) {
            reject(err);
          } else {
            console.log('Connected succesfully to mongo');
            resolve(this.client.db(this.dbName));
          }
        })
      })
    } else {
      return MongoLib.connection;
    }
  }
}

module.exports = MongoLib;