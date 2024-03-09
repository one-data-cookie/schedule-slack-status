// Load CRON from source with caching
// https://www.npmjs.com/package/croner?activeTab=readme
function loadCronLibrary() {
  const key = 'croner@8';
  const url = 'https://cdn.jsdelivr.net/npm/croner@8/dist/croner.umd.min.js';
  const cache = CacheService.getScriptCache();

  // Check if the library content is already cached
  const cachedContent = cache.get(key);
  if (cachedContent) return cachedContent;

  // Fetch the library content from the specified URL
  const libraryContent = UrlFetchApp.fetch(url, {
    muteHttpExceptions: false,
  }).getContentText();

  // Check if the fetched content contains the word "Cron"
  if (/Cron/.test(libraryContent)) {
    // Cache the library for 12 hours
    cache.put(key, libraryContent, 60 * 60 * 12);
    return libraryContent;
  }

  throw new Error('The cron library is unavailable');
};

// Get the next trigger time from all CRON expressions
// https://www.labnol.org/trigger-cron-expressions-230902
// https://developers.google.com/apps-script/guides/services/quotas#current_limitations
function getNextCronTriggerTime(cronExpressions) {
  eval(loadCronLibrary());
  let allTriggers = [];

  cronExpressions.forEach(cronExpression => {
    const trigger = Cron(cronExpression).nextRun();
    allTriggers = allTriggers.concat(trigger);
  });

  const nextTrigger = allTriggers.sort((a, b) => a - b)[0]; // earliest date

  console.log('Next CRON trigger time: ' + nextTrigger.toString());
  return nextTrigger;
};

// Get a recent trigger time from all CRON expressions
function getRecentCronTriggerTime(cronExpressions) {
  eval(loadCronLibrary());
  let recentTrigger = null;

  cronExpressions.forEach(cronExpression => {
    let now = new Date();
    let fourMinsAgo = new Date(now.getTime() - (4 * 60000)); // 4m ago

    const nextTrigger = Cron(cronExpression).nextRun(fourMinsAgo); // runs from 4m ago and onwards

    if (nextTrigger < now && (!recentTrigger || nextTrigger > recentTrigger)) {
      recentTrigger = nextTrigger; // assign if in the past and empty or closer to now
    }
  });

  console.log('Recent CRON trigger time' +
    (recentTrigger ?
      ': ' +
      recentTrigger.toString() :
      ' is not found'));
  return recentTrigger;
}
