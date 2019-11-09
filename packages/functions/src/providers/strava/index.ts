import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import axios from 'axios';

const { client_id, client_secret } = functions.config().strava;

type StravaTokenAPIParams =
  | { grant_type: 'authorization_code'; code: string }
  | { grant_type: 'refresh_token'; refresh_token: string };

const callStravaTokenAPI = (params: StravaTokenAPIParams) =>
  axios.post('https://www.strava.com/oauth/token', {
    client_id,
    client_secret,
    ...params,
  });

const getProviderDocRef = (uid: string) =>
  admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('linkedProviders')
    .doc('strava');

passport.use(
  new Strategy((token, callback) => {
    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => callback(null, decodedToken))
      .catch(error => {
        console.log(
          `Id token verification failed with error code: '${error.code}'`
        );
        if (
          error.code === 'auth/argument-error' ||
          error.code === 'auth/id-token-expired'
        ) {
          callback(null, false);
        } else {
          callback(error);
        }
      });
  })
);

const router = express.Router();

router.use(cors({ origin: true }));
router.use(express.json());

router.post(
  '/link',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    const { uid } = <any>req.user;
    const { code, scope } = req.body;

    if (!code || !scope) {
      res.sendStatus(400);
      return;
    }

    try {
      const stravaResponse = await callStravaTokenAPI({
        grant_type: 'authorization_code',
        code,
      });
      const {
        access_token,
        expires_at,
        expires_in,
        refresh_token,
      } = stravaResponse.data;

      await getProviderDocRef(uid).set({ refresh_token, code });

      res.json({ access_token, expires_at, expires_in });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  '/token',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    const { uid } = <any>req.user;

    try {
      const doc = await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('linkedProviders')
        .doc('strava')
        .get();

      if (!doc.exists) {
        res.sendStatus(404);
        return;
      }

      const refresh_token = doc.get('refresh_token');
      const stravaResponse = await callStravaTokenAPI({
        grant_type: 'refresh_token',
        refresh_token,
      });
      const {
        access_token,
        expires_at,
        expires_in,
        refresh_token: new_refresh_token,
      } = stravaResponse.data;

      await getProviderDocRef(uid).set(
        { refresh_token: new_refresh_token },
        { merge: true }
      );

      res.json({ access_token, expires_at, expires_in });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
