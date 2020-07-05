import { openDb } from '../helper/idb.js';
import material from '../helper/material.js';
import match from '../data/match-data.js';

const savedMatchScript = async () => {
  try {
    openDb();

    const matches = await match.pinned();
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
    }

    const matchTable = document.createElement('match-table');
    matchTable.data = template;
    material.closePreLoader();

    const saved = document.querySelector('#saved');
    saved.innerHTML = "";
    saved.appendChild(matchTable);
    document.querySelectorAll('.delete-pinned-match').forEach(btn => {
      btn.addEventListener('click', () => {
        deletePinnedMatch(btn.dataset.matchid)
      })
    })

    material.initializeTooltip();
  } catch (error) {
    // console.debug(error.message);
  }
}

const deletePinnedMatch = async (event) => {
  try {
    await match.delete(event);
    savedMatchScript();
    material.toast('Data berhasil dihapus')
  } catch (error) {
    // console.debug('Delete Match: ', error.message);
  }
}

export {
  savedMatchScript
}