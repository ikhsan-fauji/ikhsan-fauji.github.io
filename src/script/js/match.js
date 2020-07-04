import '../component/MatchTable.js';
import material from '../helper/material.js';
import { getDate, getTime } from '../helper/date.js';
import { openDb, bulkUpsert } from '../helper/idb.js';
import match from '../data/match-data.js';

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

const _matchTable = (content, finished = false) => {
  const matchTable = document.createElement('match-table');
  matchTable.finished = finished;
  matchTable.data = content;
  return matchTable;
}

const _scheduledMatches = async () => {
  try {
    const scheduledElement = document.querySelector('#scheduled');
    const matches = await match.scheduled();
    let template = '';
    if (matches.length > 0) {
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
              data-hometeam="${match.homeTeam.name}"
              data-awayteam="${match.awayTeam.name}"
              data-date="${match.utcDate}"
            >
              <i class="material-icons left">bookmark</i>
            </a>
          </td>
        </tr>
        `;
      });
    }

    material.closePreLoader();
    scheduledElement.appendChild(_matchTable(template));
    const pinBtns = document.querySelectorAll('.pin-match');
    if (pinBtns) {
      pinBtns.forEach(pin => {
        pin.addEventListener('click', () => {
          const { match, hometeam, awayteam, date } = pin.dataset
          pinMatch(match, hometeam, awayteam, date);
        })
      })
      material.initializeTooltip();
    }

    await isSaved();
  } catch (error) {
    console.debug(error.message);
  }
}

const pinMatch = async (matchId, homeTeam, awayTeam, date) => {
  try {
    if (homeTeam && awayTeam) {
      const payload = [
        {
          id: matchId,
          homeTeam,
          awayTeam,
          matchDate: getDate(date),
          matchTime: getTime(date)
        }
      ]
      await bulkUpsert('pined_match', payload);
      material.toast('Pertandingan berhasil disimpan');
      isSaved();
    } else {
      material.toast('Tidak dapat menyimpan data');
    }
  } catch (error) {
    // console.debug(error.message);
  }
}

/* Finished Matches */
const _finishedMatches = async () => {
  try {
    const matches = await match.finished();
    const finishedElement = document.querySelector('#finished');

    let template = '';
    if (matches.length > 0) {
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
    }

    material.closePreLoader();
    finishedElement.appendChild(_matchTable(template, true));

  } catch (error) {
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