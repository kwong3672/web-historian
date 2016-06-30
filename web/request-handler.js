var path = require('path');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');
// require more modules/folders here!
var httpHelpers = require('./http-helpers'); // headers and serve assets
var archiveHelpers = require('../helpers/archive-helpers'); // path information
var url = require('url'); // helps to parse out url to parts
// GET
// POST ? 
var fs = require('fs');
var statusCode = 200;

var actions = {
  'GET': function(req, res, route) {
    if (route === '/' || route === '/index.html') {
      httpHelpers.serveAssets(res, path.join(__dirname + '/public/index.html'), statusCode);
    } else if (route === '/styles.css') {
      httpHelpers.serveAssets(res, path.join(__dirname + '/public/styles.css'), statusCode, 'text/css');
    } else { 
      statusCode = 404;
      res.writeHeader(statusCode, httpHelpers.headers);
      res.write('<h1>404!</h1>');
      res.end();
    }
  },
  'POST': function(req, res, route) {

    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      var parsedUrl = qs.parse(data);
      console.log('body of post request', parsedUrl);
      // IF exists in sites folder
      archiveHelpers.isUrlArchived(parsedUrl.url, function(exists) {
        // serve file
        if (exists) {
          httpHelpers.serveAssets(res, archiveHelpers.paths.archivedSites + '/' + parsedUrl.url, 200);
        } else {
          fs.appendFile(archive.paths.list, parsedUrl.url + '\n', (err) => {
            if (!err) {
              httpHelpers.serveAssets(res, path.join(__dirname + '/public/loading.html'), 302);
            }
          });
        }

      });
    });
  }
};


exports.handleRequest = function (req, res) {
  // If the request is looking for a file
    // call serve assets 
      // response object, asset(path to file), callback

  var pUrl = url.parse(req.url);
  var currentRoute = pUrl.pathname;
  actions[req.method](req, res, currentRoute);
  // res.end(result);
  // res.end(archive.paths.list);
};
