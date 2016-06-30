var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// hasn't been saved ye
exports.readListOfUrls = function(cb) {

  fs.readFile(paths.list, (err, data) => {
    if (!err) {
      cb(data);
    } else {
      console.log(err);
    }
  });

};

// 
exports.isUrlInList = function(url) {
};

exports.addUrlToList = function(url) {
};

// exists in the sites folder
exports.isUrlArchived = function(url) {
};

exports.downloadUrls = function() {
};

exports.paths = paths;