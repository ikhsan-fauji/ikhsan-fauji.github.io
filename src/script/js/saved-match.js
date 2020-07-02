import process from '../helper/process.js';
import { openDb, getAll, deleteById } from '../helper/idb.js';
import material from '../helper/material.js';

const savedMatchScript = async (M) => {
  try {
    openDb();
    await pinedMatches();
  } catch (error) {
    console.debug(error.message);
  }
}

const pinedMatches = async () => {
  try {
    process.startProcess();

    const matches = await getAll('pined_match');
    let template = '';
    if (matches.length > 0) {
      matches.forEach(match => {
        template += `
        <tr>
          <td>${match.homeTeam} <span>Vs</span> ${match.awayTeam}</td>
          <td>${match.matchDate}</td>
          <td>${match.matchTime}</td>
          <td>
            <a href="#"
              class="delete-pinned-match tooltipped"
              data-position="bottom"
              data-tooltip="Delete Match"
              data-matchid="${match.id}"
            >
              <i class="material-icons">delete_sweep</i>
            </a>
          </td>
        </tr>
        `;
      })
    } else {
      template += `
      <tr>
        <td id="data-not-found" colspan="4" style="text-align: center;">Belum ada jadwal pertandingan yang disimpan.</td>
      </tr>
      `;
    }
    document.querySelector('#saved-match-list').innerHTML = template
    document.querySelectorAll('.delete-pinned-match').forEach(btn => {
      btn.addEventListener('click', () => {
        deletePinnedMatch(btn.dataset.matchid)
      })
    })

    material.initializeTooltip();
    process.finishProcess();
  } catch (error) {
    process.finishProcess();
    console.debug('Pinned Matches: ', error.message)
  }
}

const deletePinnedMatch = async (event) => {
  try {
    await deleteById('pined_match', event);
    pinedMatches();
    material.toast('Data berhasil dihapus')
  } catch (error) {
    console.debug('Delete Match: ', error.message);
  }
}

export {
  savedMatchScript
}