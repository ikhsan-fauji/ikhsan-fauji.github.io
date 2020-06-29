import material from '../helper/material.js';
import { homeScript } from '../js/home.js';
import { matchPageScript } from '../js/match.js';
import { favoriteClubsScript } from '../js/favorite-clubs.js';
import { savedMatchScript } from '../js/saved-match.js';
import { clubsScript, clubDetailScript, clubsData } from '../js/clubs.js';


const main = async () => {
  _initialNavigation();
  _loadPage();
}

const _initialNavigation = () => {
  material.initializeSideNav();

  let page = '';
  const links = document.querySelectorAll(".sidenav a, .topnav a");
  links.forEach(function(elm) {
    elm.addEventListener("click", function(event) {
      material.closeSideNav();
      page = event.target.getAttribute("href").substr(1);
      _loadPage(page)
    });
  });
}

const _loadPage = async (page, dataId) => {
  try {
    if(!page) page = 'home';
    const response = await fetch(`./${page}.html`);
    const template = await response.text();

    setContent(template);

    loadScript(page, dataId);
  } catch (error) {
    console.debug('_loadPage', error.message)
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
      matchPageScript();
      break;
    case 'clubs':
      await clubsScript(await clubsData(), _loadPage);
      break;
    case 'club-detail':
      clubDetailScript(dataId);
      break;
    case 'favorite-clubs':
      favoriteClubsScript(_loadPage);
      break;
    case 'saved-match':
      savedMatchScript();
      break;
    default:
      await homeScript();
      break;
  }
}

export default main;
