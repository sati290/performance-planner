import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import axios from 'axios';

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
  async (req, res) => {
    const { uid } = <any>req.user;
    const { code, scope } = req.body;
    const { client_id, client_secret } = functions.config().strava;

    if (!code || !scope) {
      res.sendStatus(400);
    }

    try {
      const authResponse = await axios.post(
        'https://www.strava.com/oauth/token',
        {
          client_id,
          client_secret,
          code,
          grant_type: 'authorization_code',
        }
      );
      const {
        access_token,
        expires_at,
        expires_in,
        refresh_token,
      } = authResponse.data;

      await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('linkedProviders')
        .doc('strava')
        .set({
          refresh_token,
          scope,
        });

      res.json({ access_token, expires_at, expires_in });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default app;
