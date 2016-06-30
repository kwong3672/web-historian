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
      cb(data.toString().split('\n'));
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

exports.downloadUrls = function(urlArray) {
  _.each(urlArray, (url) => {
    this.isUrlArchived(url, function(exists) {
      if (!exists) {
        htmlFetcher(url, function(html) {
          fs.writeFile(paths.archivedSites + '/' + url, html);
        });
      }
    });
  });

  // Clear out sites.txt??
    
};

