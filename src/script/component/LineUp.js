import parseUrl from '../helper/parseUrl.js';

class LineUp extends HTMLElement {
  constructor () {
    super();
  }

  set lineUp (match = null) {
    this._lineUp = match;
    this.render();
  }

  lineUpContent () {
    if (this._lineUp && this._lineUp.length > 0) {
      let template = '';
      this._lineUp.forEach(line => {
        template += `
        <tr>
          <td>${line.position}</td>
          <td><img src="${parseUrl(line.team.crestUrl)}" loading="lazy" alt="Logo"><span>${line.team.name}</span></td>
          <td>${line.playedGames}</td>
          <td>${line.won}</td>
          <td>${line.draw}</td>
          <td>${line.lost}</td>
          <td>${line.points}+</td>
        </tr>
        `;
      });

      return template;
    } else {
      return `
        <td colspan="7">Data tidak tersedia.</td>
      `;
    }
  }

  render () {
    this.innerHTML =  `
    <section id="schedule-lineup">
      <div class="row container">
        <div class="col s12 m12">
          <h2 class="section-title">Line Up</h2>
        </div>
        <div class="col s12 m12">
          <table class="responsive-table">
            <thead>
              <tr>
                  <th>Position</th>
                  <th>Club</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Draw</th>
                  <th>Lost</th>
                  <th>Points</th>
              </tr>
            </thead>

            <tbody id="line-up">
              ${this.lineUpContent()}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    `;
  }
}

customElements.define('line-up', LineUp);