// Set DND when requested
function setDoNotDisturb(numMinutes, token) {
  var options = {
    "method": "post",
    "contentType": "application/x-www-form-urlencoded",
    "headers": {
      "Authorization": "Bearer " + token
    },
    "payload": "num_minutes=" + numMinutes
  };

  try {
    var response = UrlFetchApp.fetch("https://slack.com/api/dnd.setSnooze", options);
    console.log(response.getContentText());
  } catch (e) {
    console.log("Failed to set Slack status: " + e.toString());
  }
}

// Set status in Slack with given emoji, expiration, and DND option
function setSlackStatus(statusText, statusEmoji, expirationMin, dnd) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_API_TOKEN');
  var expirationTime = 0;
  if (expirationMin) {
    let now = new Date().getTime()
    expirationTime = new Date(now + expirationMin * 60000).getTime() / 1000;
  }

  var status = {
    "status_text": statusText,
    "status_emoji": statusEmoji,
    "status_expiration": expirationTime
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + token
    },
    "payload": JSON.stringify({ "profile": status })
  };

  try {
    var response = UrlFetchApp.fetch("https://slack.com/api/users.profile.set", options);
    console.log(response.getContentText());
  } catch (e) {
    console.log("Failed to set Slack status: " + e.toString());
  }

  if (dnd && expirationMin) {
    setDoNotDisturb(expirationMin, token);
  }
}
