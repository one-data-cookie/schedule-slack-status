// Get details of a recent event for today
// https://developers.google.com/apps-script/reference/calendar/calendar
function getRecentCalEventDetails() {
  var tz = Session.getTimeZone();
  var now = new Date();
  var endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // end of today

  var calendarId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  var events = CalendarApp.getCalendarById(calendarId).getEvents(now, endOfDay); // from now onwards, also in progress
  if (events.length === 0) {
    console.log('No more events today.');
    return {};
  }

  var recentEventPayload = null;
  events.forEach(event => {
    var eventPayload = {
      name: event.getTitle(),
      startTime: event.getStartTime(),
      endTime: event.getEndTime(),
      length: (event.getEndTime() - event.getStartTime()) / (1000 * 60) // in mins
    };

    if (eventPayload.startTime < now && (recentEventPayload === null || recentEventPayload.startTime > recentTrigger.startTime)) {
      recentEventPayload = eventPayload; // assign if in the past and empty or closer to now
    }
  });

  console.log('Recent calendar event' + 
    (recentEventPayload ? 
      ': '
      `${recentEventPayload.name} (` +
      `${Utilities.formatDate(recentEventPayload.startTime, tz, 'HH:mm')}-` +
      `${Utilities.formatDate(recentEventPayload.endTime, tz, 'HH:mm')})` :
      ' is not found'));
}

// Get next start or end time of any event today
function getNextCalStartOrEnd() {
  var now = new Date();

  // Retrieve calendar ID and fetch events for the current day
  var calendarId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  var events = CalendarApp.getCalendarById(calendarId).getEventsForDay(now);

  // Early return if no events today
  if (events.length === 0) {
    console.log('No events today.');
    return null; // or {} if you specifically need an empty object
  }
  
  var closestTime = null;
  events.forEach(function(event) {
    var startTime = event.getStartTime();
    var endTime = event.getEndTime();

    // Check if the start time is after now and before the current closest time
    if (startTime > now && (!closestTime || startTime < closestTime)) {
      closestTime = startTime;
    }

    // Check if the end time is after now and before the current closest time
    if (endTime > now && (!closestTime || endTime < closestTime)) {
      closestTime = endTime;
    }
  });

  // Handle the case where there's no other event today
  if (closestTime === null) {
    console.log('No other events today.');
    return null;
  }

  console.log('Next time for event is: ' + closestTime);
  return closestTime;
}
