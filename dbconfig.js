let mongoose = require('mongoose');

const server = process.env.DB_HOST;
const database = process.env.DB_NAME;

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error', err)
       })
  }
}

module.exports = new Database();