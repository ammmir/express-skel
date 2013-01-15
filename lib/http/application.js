var express = require('express');
var app = module.exports = express();

// set facile as default html renderer (using cheerio)
app.engine('html', require('facile').__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/../../views');

// sub-applications
app.use(require('../main'));
app.use(require('../login'));