// Check if my Slack status is empty at the moment
function checkSlackStatusIsEmpty() {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_API_TOKEN');
  var apiUrl = 'https://slack.com/api/users.profile.get';

  // Prepare the API request options
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + token
    },
    'muteHttpExceptions': true // To prevent throwing exceptions for non-200 responses
  };

  // Make the API call
  var response = UrlFetchApp.fetch(apiUrl, options);
  var json = JSON.parse(response.getContentText());

  // Check if the API call was successful
  if (json.ok) {
    var statusEmoji = json.profile.status_emoji;
    var statusText = json.profile.status_text;


    // Determine if the status is empty
    if (statusEmoji === '' && statusText === '') {
      console.log('Slack status is empty.');
      return true; // Status is empty
    } else {
      console.log('Slack status is not empty.');
      return false; // Status is not empty
    }
  } else {
    console.error('Failed to fetch Slack profile:', json.error);
    return null; // API call was unsuccessful
  }
}

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
function setSlackStatus(statusEmoji, statusText, expirationMin, dnd) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_API_TOKEN');
  var expirationTime = 0;
  if (expirationMin) {
    let now = new Date().getTime()
    expirationTime = new Date(now + expirationMin * 60000).getTime() / 1000;
  }

  var status = {
    "status_emoji": statusEmoji,
    "status_text": statusText,
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
