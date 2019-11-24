export type AuthState =
  | { pending: true }
  | { pending: false; uid: null }
  | { pending: false; uid: string; email: string };

export enum AuthActionTypes {
  STATE_CHANGED = 'AUTH/STATE_CHANGED',
  LOGIN = 'AUTH/LOGIN',
  LOGOUT = 'AUTH/LOGOUT',
}

export interface AuthStateChangedAction {
  type: AuthActionTypes.STATE_CHANGED;
  payload: firebase.User | null;
}

export interface AuthLoginAction {
  type: AuthActionTypes.LOGIN;
  payload: firebase.User;
}

export interface AuthLogoutAction {
  type: AuthActionTypes.LOGOUT;
}

export type AuthActions =
  | AuthStateChangedAction
  | AuthLoginAction
  | AuthLogoutAction;

export interface UserData {
  gender?: 'male' | 'female';
  restingHR?: number;
  maxHR?: number;
  lthr?: number;
  linkedProviders: string[];
}

export type UserDataState =
  | { status: 'unloaded' | 'loading' | 'error' }
  | { status: 'loaded' | 'reloading'; data: UserData };

export enum UserDataActionTypes {
  FETCH_REQUESTED = 'USER_DATA/FETCH_REQUESTED',
  FETCH_SUCCEEDED = 'USER_DATA/FETCH_SUCCEEDED',
  FETCH_FAILED = 'USER_DATA/FETCH_FAILED',
  UPDATE_REQUESTED = 'USER_DATA/UPDATE_REQUESTED',
  DISCONNECT_PROVIDER_REQUESTED = 'USER_DATA/DISCONNECT_PROVIDER_REQUESTED',
}

export interface UserDataFetchRequestedAction {
  type: UserDataActionTypes.FETCH_REQUESTED;
}

export interface UserDataFetchSucceededAction {
  type: UserDataActionTypes.FETCH_SUCCEEDED;
  payload: UserData;
}

export interface UserDataFetchFailedAction {
  type: UserDataActionTypes.FETCH_FAILED;
}

export interface UserDataUpdateRequestedAction {
  type: UserDataActionTypes.UPDATE_REQUESTED;
  payload: Partial<UserData>;
}

export interface UserDataDisconnectProviderRequestedAction {
  type: UserDataActionTypes.DISCONNECT_PROVIDER_REQUESTED;
  payload: string;
}

export type UserDataActions =
  | UserDataFetchRequestedAction
  | UserDataFetchSucceededAction
  | UserDataFetchFailedAction
  | UserDataUpdateRequestedAction;
