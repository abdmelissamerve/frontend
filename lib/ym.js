import { YM_TRACKING_ID } from '../config';

export const pageview = (url) => {
  window.ym(YM_TRACKING_ID, 'hit', url);
};
