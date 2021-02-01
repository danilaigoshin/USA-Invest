import { actionTypes, Colors } from '../interfaces';
import * as actionIs from '../interfaces/actions.interfaces';

export const changeTheme = (theme: Colors): actionIs.ChangeTheme => {
  return {
    type: actionTypes.CHANGE_THEME,
    theme: theme,
  };
};
