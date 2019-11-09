type UserState =
  | { userPending: true }
  | { userPending: false; user: firebase.User | null };

export type LinkedProviderData = Array<string>;
type LinkedProvidersState =
  | { loaded: false }
  | { loaded: true; data: LinkedProviderData };

export type State = UserState & {
  linkedProviders: LinkedProvidersState;
};

export const UPDATE_USER = 'USER_CHANGE';

interface UserChangeAction {
  type: typeof UPDATE_USER;
  user: firebase.User | null;
}

export const UPDATE_LINKED_PROVIDERS = 'UPDATE_LINKED_PROVIDERS';

interface UpdateLinkedProvidersAction {
  type: typeof UPDATE_LINKED_PROVIDERS;
  data: LinkedProviderData;
}

export type ActionTypes = UserChangeAction | UpdateLinkedProvidersAction;
