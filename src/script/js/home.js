import moment from 'moment';
import lodash from 'lodash';
import { clubLogo } from './clubs.js';
import app from '../utils/enums.js';
import request from '../helper/request.js';
import process from '../helper/process.js';
import { getDate, yesterday, tomorrow, getMiliSeconds, today } from '../helper/date.js';
import { openDb, bulkUpsert, getData } from '../helper/idb.js';

const homeScript = async () => {
  try {
    openDb();

    await nextMatch();
    await lineUpData();
  } catch (error) {
    console.debug('homeScript', error.message);
  }
}

const nextMatch = async () => {
  try {
    const match = await _nextMatchData();
    const leftClub = document.querySelector('.left-club');
    const rightClub = document.querySelector('.right-club');
    if (match && leftClub && rightClub) {
      leftClub.innerHTML = `
        <img src="${request.url(match.homeLogo)}" alt="Team Logo">
        <h4>${match.homeTeam}</h4>
      `;

      rightClub.innerHTML = `
        <h4>${match.awayTeam}</h4>
        <img src="${request.url(match.awayLogo)}" alt="Team Logo">
    `;

      // Count Down Match Time
      const matchDate = moment(match.matchDate).format('DD-MM-YYYY HH:mm:ss');
      let eventTime = moment(matchDate.toString(), 'DD-MM-YYYY HH:mm:ss').unix(),
          currentTime = moment().unix(),
          diffTime = eventTime - currentTime,
          duration = moment.duration(diffTime * 1000, 'milliseconds'),
          interval = 1000;

      if(diffTime > 0) {
        setInterval(function () {
          duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
          let days = moment.duration(duration).days(),
              hours = moment.duration(duration).hours(),
              minutes = moment.duration(duration).minutes(),
              seconds = moment.duration(duration).seconds();

          days = days.toString().length === 1 ? `0${days}` : days;
          hours = hours.toString().length === 1 ? `0${hours}` : hours;
          minutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
          seconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;

          let $days = document.querySelector('#days'),
              $hours = document.querySelector('#hours'),
              $minutes = document.querySelector('#minutes'),
              $seconds = document.querySelector('#seconds');

          if ($days && $hours && $minutes && $seconds) {
            $days.innerHTML = days;
            $hours.innerHTML = hours;
            $minutes.innerHTML = minutes;
            $seconds.innerHTML = seconds ;
          }

        }, interval);
      }
    } else {
      const nextMatchContent = document.querySelector('#next-match-content');
      nextMatchContent.innerHTML = `
      <div class="col s12 title">
        <h4>Jadwal pertandingan belum tersedia.</h4>
      </div>
      `;
    }
  } catch (error) {
    console.debug('nextMatch', error.message)
  }
}

const _nextMatchData = async () => {
  try {
    const data = await getData(_getNextMatchFromServer, _saveNextMatch, 'next_match');
    return data[0];
  } catch (error) {
    console.debug('Next Match Data', error.message);
  }
}

const _parseNextMatch = async (nextMatchData) => {
  const homeLogo = await clubLogo(nextMatchData.homeTeam.id);
  const awayLogo = await clubLogo(nextMatchData.awayTeam.id);
  return {
    id: 123456789,
    homeLogo,
    awayLogo,
    homeTeam: nextMatchData.homeTeam.name,
    awayTeam: nextMatchData.awayTeam.name,
    matchDate: nextMatchData.utcDate
  }
}

const _getNextMatchFromServer = async () => {
    const dateFrom =  getDate(today(), 'YYYY-MM-DD');
    const dateTo =  getDate(tomorrow(), 'YYYY-MM-DD');
    const params = `?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const data = await request.get(`competitions/${app.LEAGUE_CODE}/matches${params}`);
    const match = await _parseNextMatch(data.matches[0]);
    return [match];
}

const _saveNextMatch = async (nextMatchData) => {
  if (nextMatchData && nextMatchData.length > 0) {
    bulkUpsert('next_match', nextMatchData); // not await so that return process not waiting inserting data to the local db is finished;
  }
}

const lineUpData = async () => {
  process.startProcess();

  const data = await _lineUpData();
  const lineUpTable = document.querySelector('#line-up');
  let template = '';
  data.forEach(line => {
    template += `
    <tr>
      <td>${line.position}</td>
      <td><img src="${request.url(line.team.crestUrl)}" alt="Logo"><span>${line.team.name}</span></td>
      <td>${line.playedGames}</td>
      <td>${line.won}</td>
      <td>${line.draw}</td>
      <td>${line.lost}</td>
      <td>${line.points}+</td>
    </tr>
    `;
  });

  if (lineUpTable) lineUpTable.innerHTML = template;

  process.finishProcess();
}

const _lineUpData = async () => {
  try {
    const lineup = await getData(_getLineupFromServer, _saveLineUp, 'line_up');
    return lodash.orderBy(lineup, ['position'], 'asc');
  } catch (error) {
    console.debug('Line up data: ', error.message);
  }
}

const _getLineupFromServer = async () => {
  const data = await request.get(`competitions/${app.LEAGUE_CODE}/standings`);
  if (data) {
    const { table } = data.standings[0];
    return table || []
  }
  return []
}

const _saveLineUp = async (lineups) => {
  const payload = [];
  await lineups.forEach(async club => {
    const teamData = { id: club.team.id, ...club };
    payload.push(teamData);
  });

  bulkUpsert('line_up', payload);
}

export {
  homeScript,
  nextMatch
}
