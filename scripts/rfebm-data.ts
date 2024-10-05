#!/usr/bin/env bun
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { rfebmAPIGetCalendar } from 'src/services/rfebm-api/get-calendar';
import { rfebmAPIGetTeam } from 'src/services/rfebm-api/get-team';
import { rfebmAPIGetWeeks } from 'src/services/rfebm-api/get-weeks';

const PRIMERA_GROUP_ID = +(process.env.PRIMERA_GROUP_ID || 0);
const PRIMERA_TEAM_ID = +(process.env.PRIMERA_TEAM_ID || 0);

process.env.RFEBM_USER_AGENT = `6&"7*/5*&,?"->(1483>%1*!("%* 0''>8.38-"?",("2#,!$(1>:64?"?,#?*='")*2" =.70IOS`;

const rootPathURL = new URL('..', import.meta.url);
const rootPath = Bun.fileURLToPath(rootPathURL);

// Calendar
const calendarCollectionPath = join(rootPath, 'src', 'content', 'calendar', 'data.json');
await mkdir(dirname(calendarCollectionPath), { recursive: true });
const calendarData = await rfebmAPIGetCalendar(PRIMERA_GROUP_ID);
if (calendarData) {
  Bun.write(calendarCollectionPath, JSON.stringify(calendarData, null, 2));
  console.log('Calendar data saved to', calendarCollectionPath);
}

// Weeks
const weeksCollectionPath = join(rootPath, 'src', 'content', 'weeks', 'data.json');
await mkdir(dirname(weeksCollectionPath), { recursive: true });
const weeksData = await rfebmAPIGetWeeks(PRIMERA_GROUP_ID);
if (weeksData) {
  await Bun.write(weeksCollectionPath, JSON.stringify(weeksData, null, 2));
  console.log('Weeks data saved to', weeksCollectionPath);
}

// Team
const teamCollectionPath = join(rootPath, 'src', 'content', 'team', 'data.json');
await mkdir(dirname(teamCollectionPath), { recursive: true });
const teamData = await rfebmAPIGetTeam(PRIMERA_TEAM_ID);
if (teamData) {
  await Bun.write(teamCollectionPath, JSON.stringify(teamData, null, 2));
  console.log('Team data saved to', teamCollectionPath);
}
