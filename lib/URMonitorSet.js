'use strict';

var matches, 
  apiKey, 
  monitorAlertContacts,
  fs = require('fs'),
  util = require('util'),
  extend = require('extend'),
  request = require('request'),
  configFile = fs.readFileSync(__dirname + '/../config.ini', 'utf8');

matches = configFile.match(/\bapiKey\s*=\s*([\w\-]+)/);
if (matches) {
  apiKey = matches[1];
} else {
  throw new Error("Can't find apiKey in config.ini.");
}

matches = configFile.match(/\bmonitorAlertContacts\s*=\s*([\w\-]+)/);
if (matches) {
  monitorAlertContacts = matches[1];
} else {
  throw new Error("Can't find monitorAlertContacts in config.ini.");
}


var URMonitorSet = module.exports = {

  pendingDeleteRequests: 0,

  queryParams : {
    "format" : "json",
    "noJsonCallback" : "1",
    "apiKey" : apiKey
  },

  getMonitors : function(callback) {
    request({
      url: "https://api.uptimerobot.com/getMonitors",
      qs: URMonitorSet.queryParams
    }, (error, response, body) => {
      var body = JSON.parse(body);
      if (body.monitors) {
        var monitors = body.monitors.monitor;
      } else {
        monitors = {};
      }
      if (callback) {
        callback(monitors);
      }
    });
  },

  deleteMonitor : function(monitor) {
    URMonitorSet.pendingDeleteRequests = URMonitorSet.pendingDeleteRequests + 1;
    request.get({
      url: "https://api.uptimerobot.com/deleteMonitor",
      qs: extend({}, URMonitorSet.queryParams, {
        monitorID : monitor.id
      })
    }, (error, response, body) => {
      URMonitorSet.pendingDeleteRequests = URMonitorSet.pendingDeleteRequests - 1;
      var body = JSON.parse(body);
      console.log(monitor.friendlyname + ' (' + monitor.id + ') deleted.', body);
    });
  },

  newMonitor: function(monitorFriendlyName, monitorURL) {
    request.get({
      url: "https://api.uptimerobot.com/newMonitor",
      qs: extend({}, URMonitorSet.queryParams, {
        "monitorAlertContacts" : monitorAlertContacts,
        "monitorType" : 1,
        "monitorFriendlyName" : monitorFriendlyName,
        "monitorURL" : monitorURL
      })
    }, (error, response, body) => {
      try {
        var body = JSON.parse(body);
        if (body.stat === 'ok') {
          console.log(monitorFriendlyName + ' inserted.', body);
        } else {
          console.log(monitorFriendlyName + ' request failed.', body);
        }
      } catch (e) {
        console.log(monitorFriendlyName + ' request errored.', body);
      }
    });
  }

}
