import * as functions from 'firebase-functions';
import * as express from 'express';
import stravaApp from './strava';

const app = express();

app.use('/api/strava', stravaApp);

export const api = functions.https.onRequest(app);
