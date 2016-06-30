var http = require('http');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
exports.htmlFetcher = function(url, cb) {
  var resultsHTML = '';
  // go get URL
  http.get('http://' + url, (err, res) => {
    if (!err) {
      var data = '';
      console.log(res.statusCode);
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        cb(err, data.toString());
      });
    } else {
      cb(err);
    }
  });
};

