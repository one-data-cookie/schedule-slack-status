// TODO: test it out
// TODO: improve logging and docs
// TODO: close it up

// Add function with logic for setting Slack status
function updateSlackStatus() {
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
      console.log("Slack status set based on your schedule.")
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
    console.log("Slack status set based on your calendar event.")
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

// Update status
function updateStatus() {
  // Load shared variables
  try {
    assignVariables();
  } catch (e) {
    console.log("Failed to assign variables: " + e.toString());
  }

  // Update Slack status
  try {
    updateSlackStatus();
  } catch (e) {
    console.log("Failed to update Slack status: " + e.toString());
  }

  // Delete triggers, except updateDaily trigger
  try {
    deleteTriggers('updateDaily');
  } catch (e) {
    console.log("Failed delete triggers: " + e.toString());
  }

  // Create next updateStatus trigger 
  try {
    createNextUpdateStatusTrigger();
  } catch (e) {
    console.log("Failed to create next updateStatus trigger: " + e.toString());
  }
}
