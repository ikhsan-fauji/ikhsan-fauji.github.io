import { getAll, deleteById } from '../helper/idb.js';
import request from '../helper/request.js';
import material from '../helper/material.js';

const favoriteClubsScript = async (onClick) => {
  try {
    const clubs = await getAll('favorite_clubs');
    let template = '<div class="row">';
    if (clubs.length > 0) {
      clubs.forEach(club => {
        template += `
        <div class="col s12 m12 l6">
          <div class="card horizontal">
            <div class="card-image favorite-image">
              <img src="${request.url(club.clubLogo)}" alt="${club.clubName}">
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <p>${club.clubName}
                  <a href="#"
                    class="delete-favorite-club"
                    data-clubid="${club.id}"
                  ><i class="material-icons right">delete_sweep</i></a>

                  <a href="#club-detail"
                    class="club-detail-link"
                    data-clubid="${club.id}"
                  ><i class="material-icons right">remove_red_eye</i></a>
                </p>
              </div>
            </div>
          </div>
        </div>
        `;
      })
    } else {
      template += `
      <div class="col s12 m12 l12 no-favorite-clubs">
        <h5>Anda belum memiliki tim favorit.</h5>
      </div>
      `;
    }
    template += '</div>';
    document.querySelector('#favorite-list').innerHTML = template

    document.querySelectorAll('.delete-favorite-club').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteFavoriteClub(btn.dataset.clubid)
      })
    })

    const detailBtns = document.querySelectorAll('.club-detail-link');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        onClick('club-detail', btn.dataset.clubid);
      })
    })
  } catch (error) {
    console.debug('Favorite Clubs: ', error.message)
  }
}

const deleteFavoriteClub = async (event) => {
  try {
    await deleteById('favorite_clubs', event);
    favoriteClubsScript();
    material.toast('Data berhasil dihapus');
  } catch (error) {
    console.debug('Delete Club: ', error.message);
  }
}

export {
  favoriteClubsScript
}