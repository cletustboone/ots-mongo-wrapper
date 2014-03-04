var
MongoClient  = require("mongodb").MongoClient,
util         = require('util'),
EventEmitter = require('events').EventEmitter,
instances = {};

function OtsMongoWrapper( options ) {

  var
  connStr = "",
  servers = [], serverOptions, database;

  if ( typeof options == "object" && !options.servers ) {
    servers.push(options.host + ':' + options.port || 27017);
  }

  if ( options.servers && options.servers.length > 0 ) {
    for (var i = 0; i < options.servers.length; i++) {
      servers.push(options.servers[i].host + ':' + options.servers[i].port || 27017);
    }
  }

  this.servers           = servers;
  this.database          = options.database;
  this.connectionOptions = options.connection_options || "";
  this.serverOptions     = options.server_options || {};
  this.db                = null;
  this.queue             = [];

  connStr = "mongodb://" + servers.join(',') + "/" + this.database + this.connectionOptions;
  MongoClient.connect( connStr, this.serverOptions, function( err, db ) {

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
