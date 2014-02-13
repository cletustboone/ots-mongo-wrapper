var
MongoClient  = require("mongodb").MongoClient,
util         = require('util'),
EventEmitter = require('events').EventEmitter,
instances = {};

function OtsMongoWrapper( options ) {

  var connStr = "";

  if ( typeof options == "object" ) {
    host          = options.host;
    port          = options.port || 27017;
    serverOptions = options.server_options;
    database      = options.database;
  }

  this.host          = host;
  this.port          = port;
  this.database      = database;
  this.serverOptions = serverOptions;
  this.db            = null;
  this.queue         = [];

  connStr = "mongodb://" + this.host + ":" + this.port + "/" + this.database;
  MongoClient.connect( connStr, function( err, db ) {

    if( err ) throw err;
    this.db = db;
    this.emit( "connected", this.db );

  }.bind( this ) );
  
}

util.inherits( OtsMongoWrapper, EventEmitter );

OtsMongoWrapper.prototype.collection = function( collectionName ) {
  var
  collection;

  // If we're connected, we can execute the query
  if ( this.db ) {
    return this.db.collection( collectionName );
  }

  // Otherwise, log that there's a problem.
  console.log( "Query on collection %s before database available.", collectionName );
  return;

}

function makeInstanceKey( options ) {
  var key;

  // For backwards compatibility or if you're just working with one connection, no need to pass in options every time.
  if ( !options ) {
    for ( key in instances ) {
      return key;
    }
  }

  return [options.host, options.port, options.database].join("-")
};

OtsMongoWrapper.instance = function( options ) {
  var
  key = makeInstanceKey( options );
  if ( !instances[key] ) {
    instances[key] = new OtsMongoWrapper( options );
  }
  return instances[key];
}

module.exports.instance = OtsMongoWrapper.instance;
