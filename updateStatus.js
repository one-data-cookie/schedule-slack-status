// unify let, var, const
// improve logging and docs
// rename to schedule-slack-status on GH
// test, close, and open-source it

// Add function with logic for setting Slack status
function setSlackStatus() {
  var updated = false;

  // CASE 0: There already is a Slack status -> do nothing
  var isSlackStatusEmpty = checkSlackStatusIsEmpty();
  if (!isSlackStatusEmpty) {
    console.log('Slack status is already set, not updating.');
    return; // exit the function
  }

  // CASE 1: There is a scheduled Slack status via CRON expression -> update Slack status 
  // Calculate the latest trigger time for each schedule and update status if any within 5 minutes
  var now = new Date();
  UPDATE_STATUS_CRONS.forEach(function(schedule) {
    var latestTriggerTime = getLatestCronTriggerTime(schedule.crons);
    if (latestTriggerTime && (now - latestTriggerTime <= 5 * 60 * 1000)) { // if within 5 mins
      setSlackStatus(schedule.statusEmoji, schedule.statusText, schedule.expirationMin, schedule.dnd);
      console.log('Slack status set based on your schedule.')
      updated = true;
      return; // exit the loop
    }
  });
  if (updated) return; // exit the function

  // CASE 2: There is the next calendar event that started within 5 mins -> update Slack status
  var nextEventDetails = getNextCalEventDetails();
  if (nextEventDetails.name && now - nextEventDetails.startTime <= 5 * 60 * 1000) { // if within 5 mins
    let statusEmoji = ":phone:"; // default emoji
    let statusText = nextEventDetails.name.trim();
    let expirationMin = nextEventDetails.length;
    let dnd = true;

    let firstChar = statusText.charAt(0);
    if (EMOJI_MAP[firstChar]) { // if the first character is one of the emojis
      statusEmoji = emojiMap[firstChar]; // use the mapped Slack emoji code
      statusText = statusText.substring(1).trim(); // remove the emoji and any leading whitespace
    }

    setSlackStatus(statusEmoji, statusText, expirationMin, dnd);
    console.log('Slack status set based on your calendar event.')
    updated = true;
  }
  if (updated) return; // exit the function with true
}

// Add function for creating next updateStatus trigger
function createNextUpdateStatusTrigger() {
  let cronExpressions = UPDATE_STATUS_CRONS.flatMap(schedule => schedule.crons);
  let nextCronTime = getNextCronTriggerTime(cronExpressions);
  let nextCalTime = getNextCalStartOrEnd(); 

  var nextTriggerTime = nextCronTime < nextCalTime ? nextCronTime : nextCalTime; // ternary operator (if then else)
  createTriggerForTime(nextTriggerTime, 'updateStatus');
}

// Update Slack status
function updateStatus() {
  // Load shared variables
  assignVariables();

  // Set Slack status
  setSlackStatus();

  // Delete all triggers, except updateDaily trigger
  deleteAllTriggers('updateDaily');

  // Create next updateStatus trigger 
  createNextUpdateStatusTrigger();
}
