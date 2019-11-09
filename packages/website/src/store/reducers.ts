import { ActionTypes, USER_CHANGE } from './actions';

export type UserState =
  | { userPending: true }
  | { userPending: false; user: firebase.User | null };

export type State = UserState;

const initialState: State = {
  userPending: true,
};

const rootReducer = (
  state: State = initialState,
  action: ActionTypes
): State => {
  switch (action.type) {
    case USER_CHANGE: {
      return {
        ...state,
        userPending: false,
        user: action.user,
      };
    }
    default:
      return state;
  }
};

export default rootReducer;
