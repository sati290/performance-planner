import { State, ActionTypes, USER_CHANGE } from './types';

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
