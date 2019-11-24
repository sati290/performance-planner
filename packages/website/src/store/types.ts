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
  | { loaded: false }
  | { loaded: true; data: UserData };

export enum UserDataActionTypes {
  RECEIVE = 'RECEIVE_USER_DATA',
  RESET = 'RESET_USER_DATA',
}

export interface ReceiveUserDataAction {
  type: UserDataActionTypes.RECEIVE;
  data: UserData;
}

export interface ResetUserDataAction {
  type: UserDataActionTypes.RESET;
}

export type UserDataActions = ReceiveUserDataAction | ResetUserDataAction;
