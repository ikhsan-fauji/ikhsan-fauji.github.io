import material from '../helper/material.js';
import { homeScript } from '../js/home.js';
import { matchPageScript } from '../js/match.js';
import { favoriteClubsScript } from '../js/favorite-clubs.js';
import { savedMatchScript } from '../js/saved-match.js';
import { clubsScript, clubsData } from '../js/clubs.js';
import { clubDetailScript } from '../js/club-detail.js';


const main = async () => {
  console.debug('=== v.145 ===')
  material.initializeSideNav(_loadPage);

  let page = window.location.hash.substr(1);
  if(!page) page = 'home';
  _loadPage(page);
}

const _loadPage = async (page, dataId) => {
  try {
    const response = await fetch(`./${page}.html`);
    const template = await response.text();

    setContent(template);

    loadScript(page, dataId);
  } catch (error) {
    // console.debug('_loadPage', error.message)
  }
}

const setContent = (contentValue) => {
  if (contentValue) {
    const content = document.querySelector('#app');
    content.innerHTML = contentValue;
  }
}

const loadScript = async (page, dataId) => {
  switch (page) {
    case 'home':
      await homeScript();
      break;
    case 'match':
      await matchPageScript();
      break;
    case 'clubs':
      await clubsScript(await clubsData(), _loadPage);
      break;
    case 'club-detail':
      clubDetailScript(dataId);
      break;
    case 'favorite-clubs':
      await favoriteClubsScript(_loadPage);
      break;
    case 'saved-match':
      await savedMatchScript();
      break;
    default:
      await homeScript();
      break;
  }
}

export default main;
