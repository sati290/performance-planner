export interface StravaAPIToken {
  accessToken: string;
  expiresAt: number;
}
export type StravaState = StravaAPIToken;

export enum StravaActionTypes {
  RECEIVE_API_TOKEN = 'RECEIVE_STRAVA_API_TOKEN',
}

export interface ReceiveStravaAPITokenAction {
  type: typeof StravaActionTypes.RECEIVE_API_TOKEN;
  data: StravaAPIToken;
}

export type StravaActions = ReceiveStravaAPITokenAction;
