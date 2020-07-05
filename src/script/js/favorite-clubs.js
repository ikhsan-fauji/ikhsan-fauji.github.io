import '../component/FavoriteClubs.js';
import material from '../helper/material.js';
import club from '../data/club-data.js';

const favoriteClubsScript = async (onClick) => {
  try {
    const clubs = await club.favorites();
    const favoriteElement = document.createElement('favorite-clubs');
    favoriteElement.clubs = clubs;
    material.closePreLoader();
    const list = document.querySelector('#favorite-list');
    list.innerHTML = "";
    list.appendChild(favoriteElement);

    const deleteBtns = document.querySelectorAll('.delete-favorite-club');
    const detailBtns = document.querySelectorAll('.club-detail-link');
    if (deleteBtns && detailBtns) {
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          deleteFavoriteClub(btn.dataset.clubid)
        })
      })

      detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          onClick('club-detail', btn.dataset.clubid);
        })
      })
    }
  } catch (error) {
    // console.debug('Favorite Clubs: ', error.message)
  }
}

const deleteFavoriteClub = async (event) => {
  try {
    await club.delete(event);
    favoriteClubsScript();
    material.toast('Data berhasil dihapus');
  } catch (error) {
    // console.debug('Delete Club: ', error.message);
  }
}

export {
  favoriteClubsScript
}