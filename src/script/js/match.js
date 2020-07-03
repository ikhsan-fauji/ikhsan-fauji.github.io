import material from '../helper/material.js';
import process from '../helper/process.js';
import { getDate, getTime } from '../helper/date.js';
import { openDb, bulkUpsert } from '../helper/idb.js';
import match from '../data/match-data.js';
import club from '../data/club-data.js';

const matchPageScript = async () => {
  try {
    openDb();

    material.initializeTabs();
    await _scheduledMatches();
    await _finishedMatches();
  } catch (error) {
    // console.debug(error.message);
  }
}

const _scheduledMatches = async () => {
  try {
    process.startProcess();

    const scheduledTable = document.querySelector('#scheduled-match');
    const matches = await match.scheduled();
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

const pinMatch = async (matchId, homeId, awayId, date) => {
  try {
    const homeTeam = await await club.getById(homeId);
    const awayTeam = await club.getById(awayId);

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
    } else {
      material.toast('Sedang offline, tidak dapat menjangkau data');
    }
  } catch (error) {
    // console.debug(error.message);
  }
}

/* Finished Matches */
const _finishedMatches = async () => {
  try {
    process.startProcess();

    const matches = await match.finished();
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
    // console.debug(error.message);
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
    const isExist = await match.pinnedByKey(el.dataset.match)
    if (isExist) {
      el.style.display = 'none';
    }
  })
}

export {
  matchPageScript
}