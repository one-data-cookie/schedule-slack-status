# schedule-slack-status

Google Apps Script (GAS) project that lets you easily schedule your Slack status using
CRON expressions and automatically update it based on your Google Calendar events.
What's nice is that it works even when you're off as it runs on Google servers.

## What it does
- Updates your Slack status as follows:
  - Checks if some Slack status is set
  - If no status is set, tries setting one based on CRON schedules
  - If no status is set and scheduled, tries setting one based on Calendar events
  - If the Calendar event starts with one of predefined emojis, sets it as status emoji
- Creates and deletes GAS triggers automatically, with continuous and daily clean-up

## Setup
- Create a new GAS project in your Google account [here](https://script.google.com/home) 
- Clone this to your GAS (use [`leonhartX/gas-github`](https://github.com/leonhartX/gas-github)
  with turning on GAS API in [User Settings](https://script.google.com/home/usersettings))
- Consider setting up
  [Cloud Logging](https://developers.google.com/apps-script/guides/logging#cloud_logging)
  for your new GAS project
- Add your Google Calendar's ID as `CALENDAR_ID` into *Project Settings > Script Properties*
- Prepare the Slack side:
  - Create a Slack app from [here](https://api.slack.com/apps)
  - Add scopes `dnd:write`, `users.profile:read`, `users.profile:write` in *OAuth & Permissions*
  - Install the app to the desired Slack Workspace
  - Copy [user token (`xoxp-*`)](https://api.slack.com/authentication/token-types#user)
  - Add it as `SLACK_API_TOKEN` into *Project Settings > Script Properties*
- Set CRON expressions for daily sync and status schedules, as well as emojis for events
  in `assignHelper.js`
- Run `updateDaily.js` once to launch
- Enjoy and update as needed! 🎉

## Best to avoid
- Colliding CRON schedules
- Colliding Calendar events
- Letting anything else set you Slack status
  (like a [huddle](https://mashable.com/article/how-to-hide-slack-huddle-status))
