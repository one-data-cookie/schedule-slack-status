// Add helper functions for handling triggers
// https://developers.google.com/apps-script/guides/triggers/installable
function deleteTriggers(exceptFunctionName) {
  let allTriggers = ScriptApp.getProjectTriggers();
  for (let trigger of allTriggers) {
    // If exceptFunctionName is provided and matches the name, skip deletion
    if (exceptFunctionName && trigger.getHandlerFunction() === exceptFunctionName) {
      continue;
    }
    ScriptApp.deleteTrigger(trigger);
  }
  console.log('Deleted triggers, ' + (exceptFunctionName ? 'except  ' + exceptFunctionName : 'with no exceptions'));
}

function createTriggerForTime(triggerDate, targetFunctionName) {
  ScriptApp.newTrigger(targetFunctionName)
    .timeBased()
    .at(triggerDate)
    .create();
  console.log('Trigger ' + targetFunctionName + ' created for ' + triggerDate.toString());
}
