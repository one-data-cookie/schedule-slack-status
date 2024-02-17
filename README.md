# schedule-slack-status

Google Apps Script (GAS) project that lets you easily schedule your Slack status using
CRON expressions, and even automatically update it based on your Google Calendar events.

## What it does
- Updates your Slack status as follows:
  - Check if some Slack status set
  - If no status, try setting status based on CRON schedules
  - If no status and no scheduled, try setting status based on Calendar events
  - If the Calendar event starts with one of predefined emojis, set it as status emoji
- Creates and deletes GAS triggers automatically, with continuous and daily clean-up

## Avoid
- Colliding CRON schedules
- Colliding Calendar events
- Letting anything else set you Slack status
  (like a [huddle](https://mashable.com/article/how-to-hide-slack-huddle-status))

## Setup
- Clone this to your GAS (use [leonhartX/gas-github](https://github.com/leonhartX/gas-github)
  with turning on GAS API in [User Settings](https://script.google.com/home/usersettings))
- Set up [Cloud Logging](https://developers.google.com/apps-script/guides/logging#cloud_logging)
- Add `CALENDAR_ID` under *Project Settings > Script Properties*
- Create a Slack app from [here](https://api.slack.com/apps),
  add scopes `dnd:write`, `users.profile:read`, `users.profile:write` in *OAuth & Permissions*,
  install the app to the right Slack Workspace,
  copy [user token (`xoxp-*`)](https://api.slack.com/authentication/token-types#user),
  add it as `SLACK_API_TOKEN` under *Project Settings > Script Properties*
- Set CRON expressions for daily sync and status schedules, as well as emojis for events
- Run `updateDaily` once
- Enjoy!
