export const RESET_STORE = 'RESET_STORE';

export type AuthState =
  | { pending: true }
  | { pending: false; uid: null }
  | { pending: false; uid: string; email: string };

export enum AuthActionTypes {
  START_UPDATE = 'AUTH/START_UPDATE',
  FINISH_UPDATE = 'AUTH/FINISH_UPDATE',
}

export interface StartAuthUpdateAction {
  type: AuthActionTypes.START_UPDATE;
  payload: firebase.User | null;
}

export interface FinishAuthUpdateAction {
  type: AuthActionTypes.FINISH_UPDATE;
  payload: firebase.User | null;
}

export type AuthActions = StartAuthUpdateAction | FinishAuthUpdateAction;

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
