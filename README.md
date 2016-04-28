## Goal

Use [UptimeRobot's api](https://uptimerobot.com/api) to quickly **REPLACE** your remote list of urls to monitor
with a local list maintained in a simple format.

## Instructions

1. Save config.ini.tmpl and urls-to-monitor.txt.tmpl without the .tmpl suffix
1. Update config.ini with
    1. your apiKey from ["My Settings"](https://uptimerobot.com/dashboard.php#mySettings)
    1. your monitorAlertContacts
        `curl -s "https://api.uptimerobot.com/getAlertContacts?apiKey=#YOUR_API_KEY#"`
1. Create a list of quoted friendly name & url pairs to monitor in http-urls-to-monitor.txt
1. npm install
1. node ./index.js
