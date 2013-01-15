var redis = require('redis'),
      url = require('url');

exports.client = function(options) {
  options = options || {};
  
  var parsedUrl = url.parse(process.env.REDIS_URL || 'redis://127.0.0.1:6379/');
  var client = redis.createClient(parsedUrl.port, parsedUrl.hostname);
  
  if(parsedUrl.auth)
    client.auth(parsedUrl.auth.split(':')[1]);

  if(options.db) {
    client.on('connect', function() {
      client.select(options.db);
    });
  }

  client.on('error', function(err) {
    console.error('Redis error', err);
  });

  return client;
};