// Update everything every day
function updateDaily() {
  // Load shared variables
  try {
    assignVariables();
  } catch (e) {
    console.log("Failed to assign variables: " + e.toString());
  }

  // Delete all triggers
  try {
    deleteTriggers();
  } catch (e) {
    console.log("Failed to do delete triggers: " + e.toString());
  }

  // Schedule next triggers
  try {
    createTriggerForTime(getNextCronTriggerTime(UPDATE_DAILY_CRONS), 'updateDaily');
  } catch (e) {
    console.log("Failed to create next updateDaily: " + e.toString());
  }
  try {
    createNextUpdateStatusTrigger();
  } catch (e) {
    console.log("Failed to create next updateStatus: " + e.toString());
  }
}
