import app from '../utils/enums.js';
import material from '../helper/material.js';
import request from '../helper/request.js';
import process from '../helper/process.js';
import { getDate, yesterday, tomorrow, getTime } from '../helper/date.js';
import { openDb, bulkUpsert, getByKey, getData, clearTable, getAll } from '../helper/idb.js';
import { orderBy } from 'lodash';

const matchPageScript = async () => {
  try {
    openDb();

    material.initializeTabs();
    await _scheduledMatches();
    await _finishedMatches();
  } catch (error) {
    console.debug(error.message);
  }
}

const _scheduledMatches = async () => {
  try {
    process.startProcess();

    const scheduledTable = document.querySelector('#scheduled-match');
    const matches = await _scheduledMatchesData();
    if (matches.length > 0) {
      let template = '';
      matches.forEach(match => {
        template += `
        <tr>
          <td>${match.homeTeam.name} <span class="text-primary"><b>Vs</b></span> ${match.awayTeam.name}</td>
          <td>${getDate(match.utcDate)}</td>
          <td>${getTime(match.utcDate)}</td>
          <td>
            <a
              class="waves-effect waves-light pin-match tooltipped"
              data-position="bottom"
              data-tooltip="Save Match"
              data-match="${match.id}"
              data-hometeam="${match.homeTeam.id}"
              data-awayteam="${match.awayTeam.id}"
              data-date="${match.utcDate}"
            >
              <i class="material-icons left">bookmark</i>
            </a>
          </td>
        </tr>
        `;
      });

      scheduledTable.innerHTML = template;

      document.querySelectorAll('.pin-match').forEach(pin => {
        pin.addEventListener('click', () => {
          const { match, hometeam, awayteam, date } = pin.dataset
          pinMatch(match, hometeam, awayteam, date);
        })
      })
    }

    material.initializeTooltip();
    process.finishProcess();
    await isSaved();
  } catch (error) {
    process.finishProcess();
    console.debug(error.message);
  }
}

const _scheduledMatchesData = async () => {
  try {
    const matches = await getData(_getScheduledMatchesFromServer, _saveScheduledMatches, 'scheduled_match');
    return orderBy(matches, ['utcDate'], 'asc');
  } catch (error) {
    console.debug('Scheduled Matches: ', error.message);
  }
}

const _getScheduledMatchesFromServer = async () => {
  const dateFrom = getDate(yesterday(), 'YYYY-MM-DD'),
        dateTo = getDate(tomorrow(7), 'YYYY-MM-DD');

  const params = `?status=SCHEDULED&dateFrom=${ dateFrom }&dateTo=${ dateTo }`;
  const data = await request.get(`competitions/${app.LEAGUE_CODE}/matches${ params }`);
  return data.matches;
}

const _saveScheduledMatches = async (matches) => {
  if (matches && matches.length > 0) {
    const payload = [];
    matches.forEach(match => {
      const { utcDate ,status ,homeTeam ,awayTeam } = match;
      payload.push({
        id: match.id,
        status,
        utcDate,
        homeTeam,
        awayTeam
      })
    });
    await clearTable('scheduled_match');
    await bulkUpsert('scheduled_match', payload);
  }
}

const pinMatch = async (matchId, homeId, awayId, date) => {
  try {
    let homeTeam = await getByKey('clubs', parseInt(homeId));
    if (!homeTeam) homeTeam = await request.get(`teams/${homeId}`);

    let awayTeam = await getByKey('clubs', parseInt(awayId));
    if (!awayTeam) awayTeam = await request.get(`teams/${awayId}`);

    if (homeTeam && awayTeam) {
      const payload = [
        {
          id: matchId,
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
          matchDate: getDate(date),
          matchTime: getTime(date)
        }
      ]
      await bulkUpsert('pined_match', payload);
      material.toast('Pertandingan berhasil disimpan');
      isSaved();
    }

  } catch (error) {
    console.debug(error.message);
  }
}

/* Finished Matches */
const _finishedMatches = async () => {
  try {
    process.startProcess();

    const matches = await _finishedMatchesData();
    const finishedTable = document.querySelector('#finished-match');

    if (matches.length > 0) {
      let template = '';
      matches.forEach(match => {
        template += `
        <tr>
          <td>${match.homeTeam.name} <span class="text-primary"><b>Vs</b></span> ${match.awayTeam.name}</td>
          <td>${getDate(match.utcDate)}</td>
          <td>${getTime(match.utcDate)}</td>
          <td>${_getScore(match.score)}</td>
        </tr>
        `;
      });
      finishedTable.innerHTML = template;
    }

    process.finishProcess();
  } catch (error) {
    process.finishProcess();
    console.debug(error.message);
  }
}

const _finishedMatchesData = async () => {
  try {
    const matches = await getData(_getFinishedMatchFromServer, _saveFinishedMatch, 'finished_match');
    return orderBy(matches, ['utcDate'], 'desc');
  } catch (error) {
    console.debug('Finished Matches: ', error.message);
  }
}

const _getFinishedMatchFromServer = async () => {
  const dateFrom = getDate(yesterday(8), 'YYYY-MM-DD'),
        dateTo = getDate(yesterday(), 'YYYY-MM-DD');

  const params = `?status=FINISHED&dateFrom=${ dateFrom }&dateTo=${ dateTo }`;
  const data = await request.get(`competitions/${app.LEAGUE_CODE}/matches${ params }`);
  return data.matches;
}

const _saveFinishedMatch = async (matches) => {
  if (matches.length > 0) {
    const payload = [];
    matches.forEach(match => {
      const { utcDate ,status ,score ,homeTeam ,awayTeam } = match;
      payload.push({
        id: match.id,
        status,
        utcDate,
        score,
        homeTeam,
        awayTeam
      })
    });

    await clearTable('finished_match');
    bulkUpsert('finished_match', payload);
  }
}

const _getScore = (score) => {
  const home = score.fullTime.homeTeam || 0;
  const away = score.fullTime.awayTeam || 0;
  return home + ' : ' + away;
}

const isSaved = async () => {
  const matches = document.querySelectorAll('.pin-match');
  await matches.forEach(async (el) => {
    const isExist = await getByKey('pined_match', el.dataset.match)
    if (isExist) {
      el.style.display = 'none';
    }
  })
}

export {
  matchPageScript
}