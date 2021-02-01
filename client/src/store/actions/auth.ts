import { actionTypes, User } from '../interfaces';
import * as actionIs from '../interfaces/actions.interfaces';

export const loadUser = (user: User): actionIs.LoadUser => {
  return {
    type: actionTypes.LOAD_USER,
    data: user,
  };
};

export const logoutUser = (): actionIs.LogoutUser => {
  return {
    type: actionTypes.LOGOUT_USER,
    data: null,
  };
};
