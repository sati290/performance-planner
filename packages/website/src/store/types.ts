interface UserData {
  uid: string;
  email: string;
}
type UserState =
  | { pending: true }
  | { pending: false; loggedIn: false }
  | { pending: false; loggedIn: true; data: UserData };

export interface AthleteData {
  gender: '' | 'male' | 'female';
  restingHR: number;
  maxHR: number;
  lthr: number;
}

type AthleteDataState = { loaded: false } | { loaded: true; data: AthleteData };

export type LinkedProviderData = Array<string>;
type LinkedProvidersState =
  | { loaded: false }
  | { loaded: true; data: LinkedProviderData };

export interface StravaAPIToken {
  accessToken: string;
  expiresAt: number;
}
type StravaAPITokenState = StravaAPIToken;

export interface State {
  user: UserState;
  athleteData: AthleteDataState;
  linkedProviders: LinkedProvidersState;
  stravaAPIToken: StravaAPITokenState;
}

export const RESET_STORE = 'RESET_STORE';

interface ResetStoreAction {
  type: typeof RESET_STORE;
}

export const UPDATE_USER = 'UPDATE_USER';

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  user: firebase.User | null;
}

export const RECEIVE_ATHLETE_DATA = 'RECEIVE_ATHLETE_DATA';

interface ReceiveAthleteDataAction {
  type: typeof RECEIVE_ATHLETE_DATA;
  data: AthleteData;
}

export const UPDATE_LINKED_PROVIDERS = 'UPDATE_LINKED_PROVIDERS';

interface UpdateLinkedProvidersAction {
  type: typeof UPDATE_LINKED_PROVIDERS;
  data: LinkedProviderData;
}

export const UPDATE_STRAVA_API_TOKEN = 'UPDATE_STRAVA_API_TOKEN';

interface UpdateStravaAPITokenAction {
  type: typeof UPDATE_STRAVA_API_TOKEN;
  data: StravaAPIToken;
}

export type ActionTypes =
  | ResetStoreAction
  | UpdateUserAction
  | ReceiveAthleteDataAction
  | UpdateLinkedProvidersAction
  | UpdateStravaAPITokenAction;
