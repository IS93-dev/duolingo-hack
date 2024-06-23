const fs = require('fs');
const path = require('path');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomSchedule() {
  const times = [];
  for (let i = 0; i < 4; i++) { // 4 times a day
    const hour = getRandomInt(0, 23);
    const minute = getRandomInt(0, 59);
    times.push({ hour, minute });
  }
  return times;
}

function generateRandomLessons() {
  return getRandomInt(10, 20);
}

const schedule = generateRandomSchedule();
const lessons = generateRandomLessons();

const scheduleYaml = schedule.map(time => `  - cron: '${time.minute} ${time.hour} * * *'`).join('\n');

const workflowContent = `
name: Do a Duolingo lesson

on:
  schedule:
${scheduleYaml}

jobs:
  study:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node index.js
        env:
          DUOLINGO_JWT: \${{ secrets.DUOLINGO_JWT }}
          LESSONS: ${lessons}
`;

fs.writeFileSync(path.join(__dirname, '.github/workflows/study.yml'), workflowContent);
