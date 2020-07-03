import app from '../utils/enums.js';

const request = {
  get: async (url) => {
    try {
      const response = await fetch(`${app.BASE_URL}${url}`, {
        headers: { 'X-Auth-Token': app.API_KEY }
      });
      return response.json();
    } catch (error) {
      return null;
    }
  },
  url: (url) => {
    if (!url) return './images/team_logo.svg';
    return url.replace(/^http:\/\//i, 'https://');
  }
}

export default request;
