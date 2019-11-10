interface UserData {
  uid: string;
  email: string;
}
type UserState =
  | { pending: true }
  | { pending: false; loggedIn: false }
  | { pending: false; loggedIn: true; data: UserData };

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
  linkedProviders: LinkedProvidersState;
  stravaAPIToken: StravaAPITokenState;
}

export const RESET_STORE = 'RESET_STORE';

interface ResetStoreAction {
  type: typeof RESET_STORE;
}

export const UPDATE_USER = 'UPDATE_USER';

interface UserChangeAction {
  type: typeof UPDATE_USER;
  user: firebase.User | null;
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
  | UserChangeAction
  | UpdateLinkedProvidersAction
  | UpdateStravaAPITokenAction;
