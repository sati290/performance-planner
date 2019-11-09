import {
  State,
  ActionTypes,
  UPDATE_USER,
  UPDATE_LINKED_PROVIDERS,
} from './types';

const initialState: State = {
  userPending: true,
  linkedProviders: { loaded: false },
};

const rootReducer = (
  state: State = initialState,
  action: ActionTypes
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

export default rootReducer;
