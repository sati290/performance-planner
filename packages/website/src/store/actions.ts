import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  LinkedProviderData,
  State,
  RESET_STORE,
  UPDATE_USER,
  UPDATE_LINKED_PROVIDERS,
} from './types';

export const resetStore = () => ({ type: RESET_STORE });

export const updateUser = (
  user: firebase.User | null
): ThunkAction<void, State, null, Action> => (dispatch, getState) => {
  const state = getState();
  if (!state.user.pending && state.user) {
    dispatch(resetStore());
  }

  dispatch({
    type: UPDATE_USER,
    user,
  });
};

export const updateLinkedProviders = (data: LinkedProviderData) => {
  return { type: UPDATE_LINKED_PROVIDERS, data };
};
