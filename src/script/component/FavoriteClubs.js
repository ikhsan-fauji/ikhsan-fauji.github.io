import parseUrl from '../helper/parseUrl.js';

class FavoriteClubs extends HTMLElement {
  constructor () {
    super();
  }

  set clubs (clubs = []) {
    this._clubs = clubs;
    this.render();
  }

  favoriteContent () {
    return `
    <div class="row">
      ${this.clubList()}
    </div>
    `;
  }

  clubList () {
    let template = '';
    if (this._clubs && this._clubs.length > 0) {
      this._clubs.forEach(club => {
        template += `
        <div class="col s12 m12 l6">
          <div class="card horizontal">
            <div class="card-image favorite-image">
              <img src="${parseUrl(club.clubLogo)}" loading="lazy" alt="${club.clubName}">
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

    return template;
  }

  render () {
    this.innerHTML = this.favoriteContent();
  }
}

customElements.define('favorite-clubs', FavoriteClubs);