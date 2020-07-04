import '../component/ClubCard.js';
import { openDb } from '../helper/idb.js';
import material from '../helper/material.js';
import club from '../data/club-data.js';

const clubsScript = async (clubData, onClick) => {
  try {
    openDb();

    const clubs = document.querySelector('#clubs');

    if (clubData && clubData.length > 0) {
      clubs.innerHTML = "";
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
        if (!event.target.value) await searchClub(event.target.value, onClick);
      }
      const searchBtn = document.querySelector('#btn-search-club');
      searchBtn.onclick = async () => await searchClub(searchInpt.value, onClick);

      await isSaved();
    } else {
      clubs.innerHTML = '<h4>404 Not Found</h4>';
    }
  } catch (error) {
    // console.debug('clubsScript', error.message);
  }
}

const saveFavorite = async (clubId) => {
  try {
    const clubData = await club.getById(clubId)
    if (clubData) {
      const payload = [{
        id: clubId,
        clubName: clubData.name,
        clubLogo: clubData.crestUrl
      }]
      await club.save(payload);
      material.toast(`${clubData.name} berhasil ditambahkan ke favorit`)
      await isSaved();
    } else {
      material.toast('Sedang offline, tidak dapat menjangkau data');
    }
  } catch (error) {
    // console.debug('Save Favorite', error.message)
  }
}

const searchClub = async (value, onClick) => {
  const clubs = document.querySelector('#clubs');
  clubs.innerHTML = `
  <div id="pre-loader" class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
  `;

  const clubData = await clubsData();
  if (value) {
    const club = clubData.filter(club => club.name.includes(value));
    await clubsScript(club, onClick);
  } else {
    await clubsScript(clubData, onClick);
  }
}

const clubsData = async () => {
  return await club.getAll();
}

const clubLogo = async (teamId) => {
  const data = await club.getById(teamId);
  return data.crestUrl;
}


const isSaved = async () => {
  const favoriteBtns = document.querySelectorAll('.club-favorite');
  await favoriteBtns.forEach(async (el) => {
    const isExist = await club.favoriteByKey(el.dataset.clubid)
    if (isExist) {
      el.style.display = 'none';
    }
  })
}

export {
  clubsScript,
  clubsData,
  clubLogo
}