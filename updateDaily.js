// Update everything every day
function updateDaily() {
  console.log("Starting updateDaily!");

  // Load shared variables
  console.log("Loading shared variables");
  try {
    assignVariables();
  } catch (e) {
    console.log("Failed to assign variables: " + e.toString());
  }

  // Delete all triggers
  console.log("Deleting all triggers");
  try {
    deleteTriggers();
  } catch (e) {
    console.log("Failed to do delete triggers: " + e.toString());
  }

  // Schedule next triggers
  console.log("Scheduling next triggers");
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

  console.log("All done!")
}
