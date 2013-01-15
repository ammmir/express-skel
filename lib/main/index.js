var express = require('express');
var app = module.exports = express();

app.get('/', function(req, res) {
  res.render('index', {hello: req.session.user || 'anonymous'});
});