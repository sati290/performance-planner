import { USER_CHANGE } from './types';

export const userChangeAction = (user: firebase.User | null) => {
  return {
    type: USER_CHANGE,
    user,
  };
};
