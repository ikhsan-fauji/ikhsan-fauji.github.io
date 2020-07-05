import app from '../utils/enums.js';
import { getDate, tomorrow, yesterday, today } from "../helper/date.js";
import request from "../helper/request";
import { getByKey, getAll, deleteById } from '../helper/idb.js';

const match = {
  next: async () => {
    try {
      const dateFrom =  getDate(today(), 'YYYY-MM-DD');
      const dateTo =  getDate(tomorrow(), 'YYYY-MM-DD');
      const params = `?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      const data = await request.get(`competitions/${app.LEAGUE_CODE}/matches${params}`);
      return data.matches ? data.matches[0] : null;
    } catch (error) {
      return null
    }
  },

  scheduled: async () => {
    try {
      const dateFrom = getDate(yesterday(), 'YYYY-MM-DD'),
            dateTo = getDate(tomorrow(7), 'YYYY-MM-DD');

      const params = `?status=SCHEDULED&dateFrom=${ dateFrom }&dateTo=${ dateTo }`;
      const data = await request.get(`competitions/${app.LEAGUE_CODE}/matches${ params }`);
      return data.matches ? data.matches : [];
    } catch (error) {
      console.debug(error.message);
      return []
    }
  },

  finished: async () => {
    try {
      const dateFrom = getDate(yesterday(8), 'YYYY-MM-DD'),
        dateTo = getDate(yesterday(), 'YYYY-MM-DD');

      const params = `?status=FINISHED&dateFrom=${ dateFrom }&dateTo=${ dateTo }`;
      const data = await request.get(`competitions/${app.LEAGUE_CODE}/matches${ params }`);
      return data.matches ? data.matches : [];
    } catch (error) {
      return []
    }
  },

  getById: async (teamId) => {
    try {
      return await request.get(`teams/${teamId}`);
    } catch (error) {
      return null
    }
  },

  pinned: async () => {
    try {
      return await getAll('pined_match');
    } catch (error) {
      return null
    }
  },

  pinnedByKey: async (key) => {
    try {
      return await getByKey('pined_match', key)
    } catch (error) {
      return null
    }
  },

  delete: async (key) => {
    try {
      await deleteById('pined_match', key)
    } catch (error) {
      // return null
    }
  }
}

export default match;