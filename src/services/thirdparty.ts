import type { User } from '@/types';
import { apiInstance } from '@/api-config/api';
import firebase from 'src/utils/firebase';

async function getMaxMindData(ip: string) {
  try {
    const response = await apiInstance.getMaxMindData(ip);
    return response.data;
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function getIpLocationData(ip: string) {
  try {
    const response = await apiInstance.getMaxMindData(ip);

    let state =
      response.data.subdivisions?.length > 0
        ? response.data.subdivisions[0].names?.en || ''
        : '';

    return {
      city: response.data.city?.names?.en || '',
      state: state,
      country: response.data.country?.names?.en || '',
      countryCode: response.data.country?.iso_code || '',
      continent: response.data.continent?.names?.en || ''
    };
  } catch (err) {
    console.error(err);
    return {
      city: '',
      state: '',
      country: '',
      countryCode: '',
      continent: ''
    };
  }
}

async function getBigData(ip: string) {
  try {
    const response = await apiInstance.getBigData(ip);
    return response.data;
  } catch (err) {
    console.log(err);
    return {};
  }
}
export { getMaxMindData, getIpLocationData, getBigData };
