import parseUrl from '../helper/parseUrl.js';

class ClubCard extends HTMLElement {
  constructor () {
    super();
  }

  set club (club = null) {
    this._club = club;
    this.render();
  }

  template (club) {
    let elements = '';
    if (club) {
      elements = `
        <div class="col s6 m4 l3">
          <div class="card card-club">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="./images/stadion.jpg" alt="Background Venue">
            </div>
            <div class="card-content">
              <div class="club-logo">
                <img src="${parseUrl(club.crestUrl)}" loading="lazy" alt="Club Logo">
              </div>
              <h4>${club.name || '-'}</h4>
              <p>${club.venue || '-'}</p>
            </div>
            <div class="card-action">
              <a href="javascript:void(0)" class="club-favorite tooltipped" data-position="bottom" data-tooltip="Select Favorite" data-clubid="${club.id}"><i class="material-icons">star</i></a>
              &nbsp;
              <a class="club-detail-link" href="#club-detail" data-clubid="${club.id}"><i class="material-icons">remove_red_eye</i>&nbsp; Detail</a>
            </div>
          </div>
        </div>
      `;
    } else {
      elements = `
        <div class="col s6 m4 l3">
          <div class="card card-club">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="./images/stadion.jpg" alt="Background Stadion">
            </div>
            <div class="card-content">
              <div class="club-logo">
              <img src="${parseUrl(null)}" alt="Club Logo">
              </div>
              <h4>Club Name</h4>
              <p>Club Stadion</p>
            </div>
            <div class="card-action">
              <a class="club-favorite tooltipped" data-position="bottom" data-tooltip="Select Favorite" data-clubid="0"><i class="material-icons">star</i></a>
              &nbsp;
              <a class="club-detail-link" href="#club-detail" data-clubid="0"><i class="material-icons">remove_red_eye</i></a>
            </div>
          </div>
        </div>
      `;
    }
    return elements;
  }

  render () {
   this.innerHTML = this.template(this._club);
  }
}

customElements.define("club-card", ClubCard);
