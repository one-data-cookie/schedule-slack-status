// Add function with logic for setting Slack status
function updateSlackStatus() {
  var updated = false;

  // CASE 0: There already is a Slack status -> do nothing
  var isSlackStatusEmpty = checkSlackStatusIsEmpty();
  if (!isSlackStatusEmpty) {
    console.log("Slack status is already set, not updating");
    return updated; // exit the function
  }

  // CASE 1: There is a scheduled Slack status via CRON expression -> update Slack status 
  // Check for a recent trigger time for each schedule and update status if any
  var now = new Date();
  UPDATE_STATUS_CRONS.forEach(function(schedule) {
    var recentTriggerTime = getRecentCronTriggerTime(schedule.crons);
    if (recentTriggerTime) { // if any
      // Calculate expiration time based on the recentTriggerTime plus the expirationMin
      let expirationTime = new Date(recentTriggerTime.getTime() + schedule.expirationMin * 60000);
      setSlackStatus(schedule.statusEmoji, schedule.statusText, expirationTime, schedule.dnd);
      console.log("Slack status set based on your schedule")
      updated = true;
      return; // exit the loop
    }
  });
  if (updated) return updated; // exit the function

  // CASE 2: There is a scheduled calendar event -> update Slack status
  // Check for a recent event and update status if any
  var recentEventDetails = getRecentCalEventDetails();
  if (recentEventDetails && recentEventDetails.name) { // if any
    let statusEmoji = ":phone:"; // default emoji
    let statusText = recentEventDetails.name.trim();
    let expirationTime = recentEventDetails.endTime.getTime();
    let dnd = true;

    let firstChar = statusText.charAt(0);
    if (EMOJI_MAP[firstChar]) { // if the first character is one of the emojis
      statusEmoji = emojiMap[firstChar]; // use the mapped Slack emoji code
      statusText = statusText.substring(1).trim(); // remove the emoji and any leading whitespace
    }

    setSlackStatus(statusEmoji, statusText, expirationTime, dnd);
    console.log("Slack status set based on your calendar event")
    updated = true;
  }
  if (updated) return updated; // exit the function with true
}

// Add function for creating next updateStatus trigger
function createNextUpdateStatusTrigger() {
  let cronExpressions = UPDATE_STATUS_CRONS.flatMap(schedule => schedule.crons);
  let nextCronTime = getNextCronTriggerTime(cronExpressions);
  let nextCalTime = getNextCalStartOrEnd();

  // If both are non-null, choose the smaller (if then else)
  var nextTriggerTime = (nextCronTime && nextCalTime) ? (nextCronTime < nextCalTime ? nextCronTime : nextCalTime) 
                   : nextCronTime || nextCalTime; // if at least one is null, choose the non-null one

  createTriggerForTime(nextTriggerTime, 'updateStatus');
}

// Update status
function updateStatus() {
  console.log("Starting updateStatus!")
  
  // Load shared variables
  console.log("Loading shared variables");
  try {
    assignVariables();
  } catch (e) {
    console.log("Failed to assign variables: " + e.toString());
  }

  // Update Slack status
  console.log("Updating Slack status");
  try {
    var wasUpdated = updateSlackStatus();
    if (wasUpdated) {
      console.log("Slack status updated successfully");
    } else {
      console.log("Slack status not updated");
    }
  } catch (e) {
    console.log("Failed to update Slack status: " + e.toString());
  }

  // Delete triggers, except updateDaily trigger
  console.log("Deleting triggers, except updateDaily");
  try {
    deleteTriggers('updateDaily');
  } catch (e) {
    console.log("Failed delete triggers: " + e.toString());
  }

  // Create next updateStatus trigger 
  console.log("Creating next updateStatus trigger");
  try {
    createNextUpdateStatusTrigger();
  } catch (e) {
    console.log("Failed to create next updateStatus trigger: " + e.toString());
  }

  console.log("All done!")
}
