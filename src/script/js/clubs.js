import '../component/ClubCard.js';
import request from '../helper/request.js';
import process from '../helper/process.js';
import { getDate } from '../helper/date.js';
import { openDb, bulkUpsert, getData, getByKey } from '../helper/idb.js';
import material from '../helper/material.js';

const clubsScript = async (clubData, onClick) => {
  try {
    openDb();
    process.startProcess();

    const clubs = document.querySelector('#clubs');

    if (clubData && clubData.length > 0) {
      clubData.forEach(club => {
        const clubCard = document.createElement('club-card');
        clubCard.club = club;
        clubs.appendChild(clubCard);
      })

      const detailBtns = document.querySelectorAll('.club-detail-link');
      detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          onClick('club-detail', btn.dataset.clubid);
        })
      })

      material.initializeTooltip();
      const favoriteBtns = document.querySelectorAll('.club-favorite');
      favoriteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          saveFavorite(btn.dataset.clubid);
        })
      })

      const searchInpt = document.querySelector('#inpt-search-club');
      searchInpt.oninput = async (event) => {
        if (!event.target.value) await searchClub(event.target.value);
      }
      const searchBtn = document.querySelector('#btn-search-club');
      searchBtn.onclick = async () => await searchClub(searchInpt.value);

      await isSaved();
    } else {
      clubs.innerHTML = '<h4>404 Not Found</h4>';
    }
    process.finishProcess();
  } catch (error) {
    process.finishProcess();
    console.debug('clubsScript', error.message);
  }
}

const saveFavorite = async (clubId) => {
  try {
    const club = await getClubById(clubId)
    if (club) {
      const payload = [{
        id: clubId,
        clubName: club.name,
        clubLogo: club.crestUrl
      }]
      await bulkUpsert('favorite_clubs', payload);
      material.toast(`${club.name} berhasil ditambahkan ke favorit`)
      await isSaved();
    }
  } catch (error) {
    console.debug('Save Favorite', error.message)
  }
}

const clubDetailScript = async (teamId) => {
  material.initializeTabs();
  process.startProcess();

  const data = await request.get(`teams/${teamId}`);
  const clubProfile = document.querySelector('.club-profile');
  clubProfile.innerHTML = `
    <div class="row">
      <div class="col s12 m4 l3 xl3">
        <img src="${request.url(data.crestUrl)}" alt="Club Logo">
      </div>
      <div class="col s12 m8 l9 xl9">
        <h4>${data.name || '-'}</h4>
        <p>${data.venue || '-'}</p>
        <p><i class="material-icons">place</i> ${data.address || '-'}</p>
        <p><i class="material-icons">link</i> <a href="#!">${data.website || '-'}</a></p>
        <p><i class="material-icons">mail</i> <a href="#!">${data.email || '-'}</a></p>
        <p><i class="material-icons">phone</i> <a href="#!">${data.phone || '-'}</a></p>
      </div>
    </div>
  `;

  const activeCompetitions = document.querySelector('.active-competition-collection');
  let list = '';
  data.activeCompetitions.forEach(competition => {
    list += `
      <li class="collection-item">
        <div>
          ${competition.name}<a href="javascript:void(0)" class="secondary-content"><i class="material-icons">flag</i> ${competition.area.name}</a>
        </div>
      </li>
    `;
  });
  activeCompetitions.innerHTML = list;

  const squadTable = document.querySelector('#squad-table');
  let rows = '';
  data.squad.forEach(squad => {
    rows += `
    <tr>
      <td>${squad.name || '-'}</td>
      <td>${squad.role || '-'}</td>
      <td>${squad.position || '-'}</td>
      <td>${squad.shirtNumber || '-'}</td>
      <td>${getDate(squad.dateOfBirth, 'DD MMMM YYYY') || '-'}</td>
      <td>${squad.nationality || '-'}</td>
    </tr>
    `;
  });
  squadTable.innerHTML = rows;

  process.finishProcess();
}

const searchClub = async (value) => {
  const clubData = await getData(_getClubsFromServer, _saveClubs, 'clubs');
  if (value) {
    const club = clubData.filter(club => club.name.includes(value));
    clubsScript(club);
  } else {
    clubsScript(clubData);
  }
}

const clubsData = async () => {
  try {
    return await getData(_getClubsFromServer, _saveClubs, 'clubs');
  } catch (error) {
    console.debug('clubsData', error.message);
  }
}

const _getClubsFromServer = async () => {
  const data = await request.get('teams');
  return data.teams
}

const _saveClubs = async (teams) => {
  try {
    if (teams && teams.length > 0) {
      const clubs = [];
      await teams.forEach(async team => {
        clubs.push({
          id: team.id,
          name: team.name,
          crestUrl: team.crestUrl,
          address: team.address,
          phone: team.phone,
          website: team.website,
          email: team.email,
          founded: team.founded,
          venue: team.venue
        })
      })

      await bulkUpsert('clubs', clubs);
    }
  } catch (error) {
    console.debug('_saveClubs', error.message);
  }
}

const clubLogo = async (teamId) => {
  const data = await getClubById(teamId);
  return data.crestUrl;
}

const getClubById = async (teamId) => {
  if (!teamId) throw Error('Please provide team id');

  let club = await getByKey('clubs', parseInt(teamId));
  if (!club) club = await request.get(`teams/${teamId}`);
  return club;
}


const isSaved = async () => {
  const favoriteBtns = document.querySelectorAll('.club-favorite');
  await favoriteBtns.forEach(async (el) => {
    const isExist = await getByKey('favorite_clubs', el.dataset.clubid)
    if (isExist) {
      el.style.display = 'none';
    }
  })
}

export {
  clubsScript,
  clubDetailScript,
  clubsData,
  clubLogo
}