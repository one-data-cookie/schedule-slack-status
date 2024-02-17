// Define daily schedules
var UPDATE_DAILY_CRONS = ['0 4 * * 1-5']; // 4am on workdays

// Define Slack status schedules (that don't overlap)
var UPDATE_STATUS_CRONS = [
  { crons: ['0 8 * * 1-5'], statusEmoji: ":coffee:", statusText: "Morning Coffee", expirationMin: 30, dnd: true },
];

// Define a simple mapping for the emojis
var EMOJI_MAP = {
  '🐝': ':bee:',
  '🥗': 'green_salad:'
};

function assignVariables() {
  console.log("All variables set up!")
}
