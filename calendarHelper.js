// Get details of next event for today
// https://developers.google.com/apps-script/reference/calendar/calendar
function getNextCalEventDetails() {
  var now = new Date();
  var endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // end of today

  var calendarId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  var events = CalendarApp.getCalendarById(calendarId).getEvents(now, endOfDay);
  if (events.length === 0) {
    console.log('No more events today.');
    return {};
  }

  var nextEvent = events[0]
  var nextEventPayload = {
    name: nextEvent.getTitle(),
    startTime: nextEvent.getStartTime(),
    endTime: nextEvent.getEndTime(),
    length: (nextEvent.getEndTime() - nextEvent.getStartTime()) / (1000 * 60) // in mins
  };

  console.log(`Next calendar event is: ${nextEventPayload.name} \
  (${nextEventPayload.startTime.toLocaleString()} - ${nextEventPayload.endTime.toLocaleString()})`);
  return nextEventPayload;
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
