var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlFetcher = require('../workers/htmlfetcher').htmlFetcher;

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

exports.paths = paths;

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
  // console.log('line 30 read URLs');
  fs.readFile(paths.list, (err, data) => {
    if (!err) {
      cb(data.toString().split('\n').slice(0, -1));
    } else {
      console.log(err);
    }
  });

};

// 
exports.isUrlInList = function(url, cb) {

  this.readListOfUrls(function(data) {
    cb(_.contains(data, url));
  });

};

exports.addUrlToList = function(url, cb) {
// moved carriage return to front, causing error with extra item in array
  fs.appendFile(paths.list, url + '\n', (err) => {
    if (!err) {
      cb();
    }
  });

};

// exists in the sites folder
exports.isUrlArchived = function(url, cb) {
  fs.readdir(paths.archivedSites, function(err, files) {
    if (!err) {
      cb(_.contains(files, url));
    }
  });
};

exports.downloadUrls = function(urlArray, cb) {
  console.log('inside downloadUrls');
  _.each(urlArray, (url, i) => {
    this.isUrlArchived(url, function(exists) {
      console.log(url, exists);
      if (!exists) {
        htmlFetcher(url, function(err, html) {
          console.log(err);
          if (!err) {
            console.log('about to write!');
            fs.writeFile(paths.archivedSites + '/' + url, html, (err) => {
              if (!err && i === urlArray.length - 1) {
                cb();
              }
            });
          }
        });
      }
    });
  });

  // Clear out sites.txt??
    
};

