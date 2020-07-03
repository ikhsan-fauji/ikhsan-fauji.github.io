import moment from 'moment';
import { clubLogo } from './clubs.js';
import request from '../helper/request.js';
import process from '../helper/process.js';
import { openDb } from '../helper/idb.js';
import match from '../data/match-data.js';
import club from '../data/club-data.js';

const homeScript = async () => {
  try {
    openDb();

    await nextMatch();
    await lineUpData();
  } catch (error) {
    // console.debug('homeScript', error.message);
  }
}

const nextMatch = async () => {
  try {
    const nextMatch = await _nextMatchData();
    const leftClub = document.querySelector('.left-club');
    const rightClub = document.querySelector('.right-club');
    if (nextMatch && leftClub && rightClub) {
      leftClub.innerHTML = `
        <img src="${request.url(nextMatch.homeLogo)}" alt="Team Logo">
        <h4>${nextMatch.homeTeam}</h4>
      `;

      rightClub.innerHTML = `
        <h4>${nextMatch.awayTeam}</h4>
        <img src="${request.url(nextMatch.awayLogo)}" alt="Team Logo">
    `;

      // Count Down Match Time
      const matchDate = moment(nextMatch.matchDate).format('DD-MM-YYYY HH:mm:ss');
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
    // console.debug('nextMatch', error.message)
  }
}

const _nextMatchData = async () => {
  try {
    const data = await match.next()
    return await _parseNextMatch(data);
  } catch (error) {
    // console.debug('Next Match Data', error.message);
    return null;
  }
}

const _parseNextMatch = async (nextMatchData) => {
  if (!nextMatchData) return null;

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

const lineUpData = async () => {
  process.startProcess();

  const data = await club.lineUp();
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

export {
  homeScript,
  nextMatch
}
