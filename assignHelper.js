// Define daily schedules
var UPDATE_DAILY_CRONS = ['0 4 * * 1-5']; // 4am on workdays

// Define Slack status schedules (that don't overlap)
var UPDATE_STATUS_CRONS = [
  { crons: ['0 8 * * 1-5'], statusText: "Morning Coffee", statusEmoji: ":coffee:", expirationMin: 30, dnd: true },
];

function assignVariables() {
  console.log("All variables set up!")
}
