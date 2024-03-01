// Get details of next event for today
// https://developers.google.com/apps-script/reference/calendar/calendar
function getNextCalEventDetails() {
  var now = new Date();
  var endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // end of today

  var calendarId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  var events = CalendarApp.getCalendarById(calendarId).getEvents(now, endOfDay);
  console.log('Upcoming events: ' + events.toString());
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

  console.log('Next calendar event is: ' + nextEventPayload.toString());
  return nextEventPayload;
}

// Get next start or end time of any event today
function getNextCalStartOrEnd() {
  var now = new Date();

  var calendarId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  var events = CalendarApp.getCalendarById(calendarId).getEventsForDay(now);
  console.log('Events for today: ' + events.toString());  
  if (events.length === 0) {
    console.log('No events today.');
    return {};
  }
  
  var closestTime = null;
  events.forEach(function(event) {
    var startTime = event.getStartTime();
    var endTime = event.getEndTime();

    // Check start time
    if (startTime > now && (!closestTime || startTime < closestTime)) {
      closestTime = startTime;
    }

    // Check end time
    if (endTime > now && (!closestTime || endTime < closestTime)) {
      closestTime = endTime;
    }
  });

  console.log('Next time for event is: ' + closestTime.toString());
  return closestTime;
}
