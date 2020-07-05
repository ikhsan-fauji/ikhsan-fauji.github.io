import app from '../utils/enums.js';
import request from "../helper/request";
import { getByKey, bulkUpsert, deleteById, getAll } from '../helper/idb.js';

const club = {
  lineUp: async () => {
    try {
      const data = await request.get(`competitions/${app.LEAGUE_CODE}/standings`);
      if (data) {
        const { table } = data.standings[0];
        return table || []
      }
      return []
    } catch (error) {
      return []
    }
  },

  getAll: async () => {
    try {
      const data = await request.get('teams');
      return data ? data.teams : [];
    } catch (error) {
      return []
    }
  },

  getById: async (teamId) => {
    try {
      if (!teamId) throw Error('Please provide teamId');
      return await request.get(`teams/${teamId}`);
    } catch (error) {
      return null
    }
  },

  favorites: async () => {
    try {
      return await getAll('favorite_clubs')
    } catch (error) {
      return null
    }
  },

  favoriteByKey: async (key) => {
    try {
      return await getByKey('favorite_clubs', key)
    } catch (error) {
      return null
    }
  },

  save: async (payload) => {
    try {
      await bulkUpsert('favorite_clubs', payload)
    } catch (error) {
      // console.debug(error.message)
    }
  },

  delete: async (key) => {
    try {
      await deleteById('favorite_clubs', key)
    } catch (error) {
      // console.debug(error.message)
    }
  }
}

export default club;