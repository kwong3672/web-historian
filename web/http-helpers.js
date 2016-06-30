var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};



exports.serveAssets = function(res, asset, statusCode, contentType) {
  headers['Content-Type'] = contentType || 'text/html';

  fs.readFile(asset, (err, data) => {
    if (!err) {
      res.writeHead(statusCode, headers);
      res.end(data); 
    } else {
      console.log(err);
      res.writeHead(401, headers);
      res.end();
    }
  });
};

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!


exports.headers = headers;