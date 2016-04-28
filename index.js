'use strict';

var matches,
  fs = require('fs'),
  URMonitorSet = require(__dirname + '/lib/URMonitorSet'),
  urlFile = fs.readFileSync(__dirname + '/http-urls-to-monitor.txt', 'utf8'), 
  lines = urlFile.split('\n');

URMonitorSet.getMonitors((monitors) => {

  if (monitors.length) {
    monitors.forEach((monitor, i) => {
      // be kind to UR and make 1 request per sec
      setTimeout(() => {
        URMonitorSet.deleteMonitor(monitor);
      }, i * 1000);
    });
  }

  var checkIfDeletionsComplete = setInterval(() => {
    if (!URMonitorSet.pendingDeleteRequests) {
      clearInterval(checkIfDeletionsComplete);
      lines.forEach((currentLine, i) => {
        // be kind to UR and make 1 request per sec
        setTimeout(() => {
          if (matches = currentLine.match(/^\s*"([^"]+)"\s+"([^"]+)"/)) {
            URMonitorSet.newMonitor(matches[1], matches[2]);
          }
        },i * 1000);
      });
    } else {
      console.log('Waiting for deletions to complete.');
    }
  }, 1000);

});
