/**
 * MongoDB connectivity file.
 */
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURI = process.env.MONGO_URI;
let _db;
/**
 * initDb function to connect the mongo database
*/
const initDb = callback => {
    if (_db) {
        console.log('Database is already initialized!');
        return callback(null, _db);
    }
    MongoClient.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(client => {
            _db = client.db();
            return callback(null, _db);
        })
        .catch(err => {
            return callback(err, '');
        })
}

/**
 * getDb function to fetch the current connect DB
*/

const getDb = () => {
    if (!_db) {
        throw Error('Database not initialzed!')
    }
    return _db;
}

export {
    initDb,
    getDb
}