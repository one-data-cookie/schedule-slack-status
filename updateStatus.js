// create function out of 26+ and use both here and in updateDaily
// set up the logic: overriding status with special character (> nothing), cron schedule (> cron schedule), calendar (> calendar start, emoji vs not emoji), else (> nothing)

// unify let, var, const
// improve logging and docs
// rename to schedule-slack-status on GH
// test, close, and open-source it

// Calculate the latest trigger time for each schedule and update status if within 5 minutes
function updateStatus() {
  // Load shared variables
  assignVariables();

  // Delete all triggers, except updateDaily trigger
  deleteAllTriggers('updateDaily');

  // Update Slack status
  var now = new Date();
  UPDATE_STATUS_CRONS.forEach(function(schedule) {
    if (now - getLatestCronTriggerTime(schedule.crons) <= 5 * 60 * 1000) { // if 5m ago
      setSlackStatus(schedule.statusText, schedule.statusEmoji, schedule.expirationMin, schedule.dnd);
    }
  });

  // Create next updateStatus trigger
  let cronExpressions = UPDATE_STATUS_CRONS.flatMap(schedule => schedule.crons);
  let nextCronTime = getNextCronTriggerTime(cronExpressions);
  let nextCalTime = getNextCalStartOrEnd(); 

  var nextTriggerTime = nextCronTime < nextCalTime ? nextCronTime : nextCalTime; // ternary operator (if then else)
  createTriggerForTime(nextTriggerTime, 'updateStatus');
}
