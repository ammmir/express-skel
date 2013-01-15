#!/usr/bin/env node
/**
 * app.js
 * main entry point
 */

var express = require('express'),
      redis = require('redis'),
       http = require('http');

var utils = require('./lib/utils');

process.on('uncaughtException', function(e) {
  console.error("Uncaught exception: %s", e.stack);
  process.exit(1);
});

var app = express();

app.configure('development', function() {
  app.use(express.logger('dev'));
});

app.configure('production', function() {
  app.use(express.logger());

  // report real client IP addresses in logs (enable only if behind a reverse proxy)
  //app.enable('trust proxy');
});

app.configure(function() {
  // limit request body size
  app.use(express.limit('1mb'));

  // serve static files out of public directory
  app.use(express.static(__dirname + '/public'));

  // query string parser (populates req.query)
  app.use(express.query());

  // body parser (populate req.body)
  app.use(express.bodyParser());

  // cookie parser (populates req.cookies)
  app.use(express.cookieParser());

  // persisted sessions in Redis
  var RedisStore = require('connect-redis')(express);

  app.use(express.session({
    store: new RedisStore({client: utils.redis.client()}),
    secret: process.env.SESSION_SECRET || 'CHANGEME, preferably set env var',
    key: 'sid',
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      secure: false // only send cookies over HTTPS connections?
    }
  }));

  // cookie-based sessions
  /*app.use(express.cookieSession({
    secret: process.env.SESSION_SECRET || 'CHANGEME, preferably set env var',
    key: 'sid',
    cookie: {
      maxAge: 60 * 60 * 1000
    }
  }));*/

  // Cross-Site Request Forgery (CSRF) token (_csrf) verification
  //app.use(express.csrf());

  // add X-Response-Time header
  app.use(express.responseTime());

  // efficient favicon serving
  //app.use(express.favicon(__dirname + '/public/favicon.ico'));
});

app.configure(function() {
  express.errorHandler.title = 'MyApp';

  // show detailed errors only in development mode
  app.use(express.errorHandler('production' == app.settings.env ? null : {dumpExceptions: true, showStack: true}));
});

// mount application
app.use(require('./lib/http').application);

var server = http.createServer(app);

// uncomment if you want socket.io
/*var io = require('socket.io').listen(server);

io.configure(function() {
  io.set('transports', ['websocket', 'xhr-polling']);

  // uncomment if you need cross-domain access to socket.io
  //io.set('origins', ['myapp.tld:*']);

  if('production' == app.settings.env) {
    var RedisStore = require('socket.io/lib/stores/redis');

    io.enable('browser client minification');
    io.enable('browser client etag');
    io.set('log level', 1);
    io.set('close timeout', 10);

    var publisher = utils.redis.client();
    var subscriber = utils.redis.client();
    var store = utils.redis.client();

    io.set('store', new RedisStore({redisPub: publisher, redisSub: subscriber, redisClient: store}));
  } else {
    io.set('log level', 2);
  }
});

// socket connection handler lives in its own local module
io.sockets.on('connection', require('./lib/http').socket);*/

server.listen(process.env.PORT || 8080, function() {
  console.log("MyApp listening on port %d", server.address().port);
});