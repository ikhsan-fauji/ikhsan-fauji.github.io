import '../component/NextMatch.js';
import '../component/LineUp.js';
import { clubLogo } from './clubs.js';
import { openDb } from '../helper/idb.js';
import match from '../data/match-data.js';
import club from '../data/club-data.js';
import material from '../helper/material.js';

const homeScript = async () => {
  openDb();

  await nextMatch();
}

const _homeContent = (child) => {
  const content = document.querySelector('#content');
  content.appendChild(child);
}

const nextMatch = async () => {
  try {
    const nextMatch = await _nextMatchData();
    const nextMatchElement = document.createElement('next-match');
    nextMatchElement.nextMatch = nextMatch;
    material.closePreLoader();
    _homeContent(nextMatchElement);
    await lineUpData();

    if (nextMatch) {
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
  const data = await club.lineUp();
  const lineUpTable = document.createElement('line-up');
  lineUpTable.lineUp = data;
  _homeContent(lineUpTable);
}

export {
  homeScript
}
