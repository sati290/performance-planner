import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import stravaApp from './providers/strava';

admin.initializeApp();

const app = express();

app.use('/api/providers/strava', stravaApp);

export const api = functions.https.onRequest(app);
