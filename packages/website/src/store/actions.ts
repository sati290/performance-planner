export const USER_CHANGE = 'USER_CHANGE';

interface UserChangeAction {
  type: typeof USER_CHANGE;
  user: firebase.User | null;
}

export type ActionTypes = UserChangeAction;

export const userChangeAction = (
  user: firebase.User | null
): UserChangeAction => {
  return {
    type: USER_CHANGE,
    user,
  };
};
