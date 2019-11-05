import * as functions from 'firebase-functions';
import stravaAuthorizeApp from './strava/authorize';

export const stravaAuthorize = functions.https.onRequest(stravaAuthorizeApp);
