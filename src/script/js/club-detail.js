
import parseUrl from '../helper/parseUrl.js';
import { getDate } from '../helper/date.js';
import club from '../data/club-data.js';
import material from '../helper/material.js';

const clubDetailScript = async (teamId) => {
  const data = await club.getById(teamId);
  const clubProfile = document.querySelector('#detail');
  if (data.id) {
    clubProfile.innerHTML = `
    <div class="card club-profile linear-primary">
      <div class="row">
        <div class="col s12 m4 l2 xl2">
          <img src="${parseUrl(data.crestUrl)}" alt="Club Logo">
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
    </div>

    <section id="tabs-detail">
      <div class="row">
        <div class="col s12">
          <ul id="tabs-swipe-demo" class="tabs">
            <li class="tab col s3"><a href="#active-competition">Competitions</a></li>
            <li class="tab col s3"><a href="#squad">Squad</a></li>
          </ul>
          <div id="active-competition" class="col s12">
            ${_activeCompetitions(data)}
          </div>
          <div id="squad" class="col s12">
            ${_squadList(data)}
          </div>
        </div>
      </div>
    </section>
    `;

    material.initializeTabs();
    material.closePreLoader();
  } else {
    material.closePreLoader();
    clubProfile.innerHTML = `
    <div class="row">
      <div class="col s12 m12 l2 xl2" style="text-align: center; padding-top: 15%;">
        <h5>Tidak dapat menampilkan data</h5>
      </div>
    </div>
    `;
    material.toast('Tidak dapat mengambil data');
  }
}

const _activeCompetitions = (data) => {
  let template = `<ul class="collection active-competition-collection">`;
  if (data.activeCompetitions && data.activeCompetitions.length > 0) {
    data.activeCompetitions.forEach(competition => {
      template += `
        <li class="collection-item">
          <div>
            ${competition.name}<a href="javascript:void(0)" class="secondary-content"><i class="material-icons">flag</i> ${competition.area.name}</a>
          </div>
        </li>
      `;
    });
  } else {
    template += `
    <li class="collection-item">
      <div>
        Tidak ada kompetisi aktif yang diikuti
      </div>
    </li>
    `;
  }
  template += `</ul>`;
  return template;
}

const _squadList = (data) => {
  let template = `
  <table class="responsive-table">
    <thead>
      <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Position</th>
          <th>Shirt Number</th>
          <th>Date of Birth</th>
          <th>Nationality</th>
      </tr>
    </thead>

    <tbody id="squad-table">
  `;

  if (data.squad && data.squad.length > 0) {
    data.squad.forEach(squad => {
      template += `
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
  } else {
    template += `
      <tr>
        <td colspan="5" style="text-align: center;">Data Tidak Tersedia</td>
      </tr>
    `;
  }

  template += `
    </tbody>
  </table>
  `;
  return template;
}

export {
  clubDetailScript
}