class MatchTable extends HTMLElement {
  constructor () {
    super();
  }

  set data (data = null) {
    this._data = data
    this.render();
  }

  set finished (finished = false) {
    this._finished = finished;
  }

  table () {
    return `
      <table class="responsive-table">
        ${this.header()}
        ${this.body()}
      </table>
    `;
  }

  header () {
    return `
      <thead>
        <tr>
            <th>Match</th>
            <th>Date</th>
            <th>Time</th>
            ${this._finished ? '<th>Score</th>' : '<th>Action</th>'}
        </tr>
      </thead>
    `;
  }

  body () {
    let bodyTemplate = `<tbody>`;
    if (this._data) {
      bodyTemplate += this._data;
    } else {
      bodyTemplate += `
        <tr>
          <td colspan="4">Data tidak tesedia</td>
        </tr>
      `;
    }
    bodyTemplate += `</tbody>`;
    return bodyTemplate;
  }

  render () {
    this.innerHTML = this.table();
  }
}

customElements.define('match-table', MatchTable);