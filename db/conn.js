require('dotenv').config();

const pgp = require('pg-promise')({
  query: e => {
    if (process.env.DEBUG) {
      console.log('QUERY: ', e.query);
      if (e.params) {
        console.log('PARAMS:', e.params);
      }
    }      
  }  
});

const options = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
};

const db = pgp(options);

module.exports = db;
