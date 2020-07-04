import app from '../utils/enums.js';


const request = {
  get: async (url) => {
    try {
      const response = await fetch(`${app.BASE_URL}${url}`, {
        headers: { 'X-Auth-Token': app.API_KEY }
      });
      return response.json();
    } catch (error) {
      // console.debug(error.message);
    }
  }
}

export default request;
