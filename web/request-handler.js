var path = require('path');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');
// require more modules/folders here!
var httpHelpers = require('./http-helpers'); // headers and serve assets
var archiveHelpers = require('../helpers/archive-helpers'); // path information
var url = require('url'); // helps to parse out url to parts

// Why do we need qs, path, and url modules?
// They do the same thing?  Parse or pull out necessary url string?
var fs = require('fs');
var statusCode = 200;
var _ = require('underscore');

// add content-type variable
var contentType, fileType, contentPrefix;

var dataToSend = 'initial value';

// get url and parse it so we can use the values still need the url 
var targetUrl = path.parse('???????');

var types = {
  'html': 'text',
  'css': 'text',
  'jpg': 'application',
  'json': 'application',
};

var filePaths = [archive.paths.siteAssets, archive.paths.archivedSites];

var doesFileExist = function(paths, route, cb) {
  _.each(paths, (path) => {
    fs.readdir(path, function(err, files) {
      if (!err) {
        console.log('route', route);
        cb(null, _.contains(files, route.slice(1)));
      } else {
        cb(err);
      }
    });
  });
};

var actions = {
  'GET': function(req, res, route) {
    if (route === '/') {
      route = '/index.html';
    }

    doesFileExist(filePaths, route, function(err, exists) {
      console.log(exists);
      if (!err || exists) {
        statusCode = 200;
        fileType = route.split('.')[1];
        contentType = types[fileType] + '/' + fileType;
        console.log('line 50 ', dataToSend);
        dataToSend = path.join(__dirname, '/public' + route); // t
        httpHelpers.serveAssets(res, dataToSend, statusCode, contentType);
      } else {
        statusCode = 404;
        contentType = 'text/html';
        dataToSend = '<h1>404!</h1>';
        httpHelpers.serveAssets(res, dataToSend, statusCode, contentType);
      }
    });
    console.log(dataToSend, route);

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
