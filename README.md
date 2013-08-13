ots-mongo-wrapper
=================

Wraps the node MongoDB native driver in an event emitter that emits `connected` when the database connection is established.

`npm install ots-mongo-wrapper`

Connection Options
------------------

The constructor expects a connection object like this:
```JSON
{
  "host": "localhost",
  "port": 27021,
  "server_options": {
    "auto_reconnect": false,
    "poolSize": 20
  },
  "database": "DBNAME"
}
```
The options object is formatted to a [standard MongoDB URL connection string](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html).

How to interact with it
-----------------------
```JavaScript
var
MongoWrapper = require("ots-mongo-wrapper"),
dbs          = require("./path-to-connection-file"),
env          = process.env.NODE_ENV || null,
mongoWrapper = new MongoWrapper( dbs[env] );

// Wait for connected event.
mongoWrapper.on( "connected", function( db ) {
    db.collection("collectionName").find().toArray(function( err, docs ) {
        // Do stuff with docs.
    });
});
```
