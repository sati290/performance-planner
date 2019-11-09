type UserState =
  | { userPending: true }
  | { userPending: false; user: firebase.User | null };

export type State = UserState;

export const USER_CHANGE = 'USER_CHANGE';

interface UserChangeAction {
  type: typeof USER_CHANGE;
  user: firebase.User | null;
}

export type ActionTypes = UserChangeAction;
