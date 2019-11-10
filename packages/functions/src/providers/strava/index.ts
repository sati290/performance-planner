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
      const { access_token, expires_at, refresh_token } = stravaResponse.data;

      await getProviderDocRef(uid).set({
        access_token,
        expires_at,
        refresh_token,
        scope,
      });

      res.json({ access_token, expires_at });
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
      const docRef = getProviderDocRef(uid);
      const doc = await docRef.get();

      if (!doc.exists) {
        res.sendStatus(404);
        return;
      }

      let { access_token, expires_at, refresh_token } = doc.data()!;

      const refreshThreshold = Date.now() / 1000 + 1800;
      if (!access_token || !expires_at || expires_at < refreshThreshold) {
        const stravaResponse = await callStravaTokenAPI({
          grant_type: 'refresh_token',
          refresh_token,
        });
        ({ access_token, expires_at, refresh_token } = stravaResponse.data);

        await getProviderDocRef(uid).set(
          { access_token, expires_at, refresh_token },
          { merge: true }
        );
      }

      res.json({ access_token, expires_at });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
