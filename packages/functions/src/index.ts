import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import stravaApp from './strava';

admin.initializeApp();

const app = express();

app.use('/api/strava', stravaApp);

export const api = functions.https.onRequest(app);
