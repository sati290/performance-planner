import { Reducer } from 'redux';
import {
  State,
  RESET_STORE,
  UPDATE_USER,
  UPDATE_LINKED_PROVIDERS,
  ActionTypes,
} from './types';

const initialState: State = {
  userPending: true,
  linkedProviders: { loaded: false },
};

const appReducer: Reducer<State, ActionTypes> = (
  state = initialState,
  action
): State => {
  switch (action.type) {
    case UPDATE_USER: {
      return {
        ...state,
        userPending: false,
        user: action.user,
      };
    }
    case UPDATE_LINKED_PROVIDERS: {
      return {
        ...state,
        linkedProviders: { loaded: true, data: action.data },
      };
    }
    default:
      return state;
  }
};

const rootReducer: Reducer<State, ActionTypes> = (state, action) => {
  if (action.type === RESET_STORE) {
    return appReducer(undefined, action);
  } else {
    return appReducer(state, action);
  }
};

export default rootReducer;