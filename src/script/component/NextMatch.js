import parseUrl from '../helper/parseUrl.js';

class NextMatch extends HTMLElement {
  constructor () {
    super();
  }

  set nextMatch (match = null) {
    this._nextMatch = match;
    this.render();
  }

  nextMatchContent () {
    if (this._nextMatch) {
      return `
      <div class="left-club">
        <img src="${parseUrl(this._nextMatch.homeLogo)}" loading="lazy" alt="Team Logo">
        <h4>${this._nextMatch.homeTeam}</h4>
      </div>

      <div id="clock" class="match-time">
        <span id="days">0</span> :
        <span id="hours">0</span> :
        <span id="minutes">0</span> :
        <span id="seconds">0</span>
      </div>

      <div class="right-club">
        <h4>${this._nextMatch.awayTeam}</h4>
        <img src="${parseUrl(this._nextMatch.awayLogo)}" alt="Team Logo">
      </div>
      `;
    } else {
      return `
        <div class="col s12 title">
          <h4>Jadwal pertandingan belum tersedia.</h4>
        </div>
      `;
    }
  }

  render () {
    this.innerHTML =  `
    <section id="next-match">
      <div class="row container">
        <div class="col s12">
          <div class="card linear-primary">
            <div class="card-content">
              <div class="row">
                <div class="col s12 title">
                  <h4>Next Match</h4>
                </div>

                <div id="next-match-content">
                  ${this.nextMatchContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
}

customElements.define('next-match', NextMatch);