var express = require('express');
var app = module.exports = express();

app.get('/login', function(req, res) {
  if(req.session.user)
    return res.redirect('/');
  
  res.render('login');
});

app.post('/login', function(req, res) {
  req.session.user = req.body.username;
  res.redirect('/');
});

app.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  })
});