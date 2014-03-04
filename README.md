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
For a replica set, a connection object would look like this:
```JSON
{
  "servers": [
    {
      "host": "localhost",
      "port": 27017
    },
    {
      "host": "localhost",
      "port": 27018
    },
    {
      "host": "localhost",
      "port": 27019
    },
  ],
  "server_options": {
    "auto_reconnect": false,
    "poolSize": 20
  },
  "connection_options": "?replicaSet=REPLSETNAME",
  "database": "DBNAME"
}
```

The options object is formatted to a [standard MongoDB URL connection string](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html).

How to interact with it
-----------------------
```JavaScript
var
dbs = require("./path-to-connection-file"),
env = process.env.NODE_ENV || null,
db  = require("ots-mongo-wrapper")(dbs[env]);

db.collection("collectionName").find().toArray(function( err, docs ) {
  // Do stuff with docs.
});
```
There's a race condition above where you can start receiving queries before a database connection is established. The module will simply log to stdout that a query to a collection was received before the database connection was ready. Once the database connection is established, you'll start getting results as normal. If you want to avoid the race condition, do the following:

```JavaScript
var
dbs = require("./path-to-connection-file"),
env = process.env.NODE_ENV || null,
db  = require("ots-mongo-wrapper")( dbs[env] );

// Wait for connected event.
db.on( "connected", function( readyDb ) {
    readyDb.collection("collectionName").find().toArray(function( err, docs ) {
        // Do stuff with docs.
    });
});
```

Multiple Connections
--------------------

You can connect to multiple databases. The module keeps a hash of connections. The hash key is made up of the options you pass when you require. If you need the database connection you already established in another module, just pass in the identical options and you will get that client instance back. A new instance will not be created.