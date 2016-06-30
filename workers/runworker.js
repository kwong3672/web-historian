var archive = require('../helpers/archive-helpers');
var initialize = require('../web/initialize.js');
var Cron = require('cron').CronJob;

var job = new Cron ('* 1 * * * *', () => {
  archive.readListOfUrls(function(urlArray) {
    console.log(urlArray);
    archive.downloadUrls(urlArray, function() {
      initialize('../archives');
    });
  }); 
}, () => {}, true); 



