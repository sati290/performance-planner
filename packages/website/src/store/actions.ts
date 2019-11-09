import {
  UPDATE_USER,
  UPDATE_LINKED_PROVIDERS,
  LinkedProviderData,
} from './types';

export const updateUser = (user: firebase.User | null) => {
  return {
    type: UPDATE_USER,
    user,
  };
};

export const updateLinkedProviders = (data: LinkedProviderData) => {
  return { type: UPDATE_LINKED_PROVIDERS, data };
};
