import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import axios from 'axios';

const db = admin.firestore();

passport.use(
  new Strategy((token, callback) => {
    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => callback(null, decodedToken))
      .catch(error => callback(error));
  })
);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post(
  '/authorize',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const { uid } = <any>req.user;
    const { code, scope } = req.body;

    if (!code || !scope) {
      res.sendStatus(400);
    }

    axios
      .post('https://www.strava.com/oauth/token', {
        client_id: functions.config().strava.client_id,
        client_secret: functions.config().strava.client_secret,
        code,
        grant_type: 'authorization_code',
      })
      .then(response => {
        console.log(response.status);
        console.log(response.data);

        return db
          .collection('users')
          .doc(uid)
          .collection('linkedProviders')
          .doc('strava')
          .set({
            refresh_token: response.data.refresh_token,
          });
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.log('error:', error);
        res.sendStatus(500);
      });
  }
);

export default app;
