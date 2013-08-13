var
MongoClient  = require("mongodb").MongoClient,
util         = require('util'),
EventEmitter = require('events').EventEmitter;

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

  connStr = "mongodb://" + this.host + ":" + this.port + "/" + this.database;

  MongoClient.connect( connStr, function( err, db ) {

    if( err ) throw err;
    this.db = db;
    this.emit( "connected", this.db );

  }.bind( this ) );

}

util.inherits( OtsMongoWrapper, EventEmitter );

OtsMongoWrapper.prototype.collection = function( collectionName ) {

  return this.db.collection( collectionName );

}

exports.OtsMongoWrapper = OtsMongoWrapper;
