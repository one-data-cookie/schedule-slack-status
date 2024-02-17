// Update everything every day
function updateDaily() {
  // Load shared variables
  assignVariables();

  // Delete all triggers
  deleteTriggers();

  // Schedule next triggers
  createTriggerForTime(getNextCronTriggerTime(UPDATE_DAILY_CRONS), 'updateDaily');
  createTriggerForTime(getNextCronTriggerTime(UPDATE_STATUS_CRONS.flatMap(schedule => schedule.crons)), 'updateStatus');
}
