import { AppState, Action, actionTypes } from '../interfaces';
import { HYDRATE } from 'next-redux-wrapper';
import { themeWhite } from '../../themes';

export const initialState = {
  colors: themeWhite.colors,
};

const reducer = (
  state = initialState,
  action: Action | { type: typeof HYDRATE; payload: AppState }
) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.theme };

    case actionTypes.CHANGE_THEME:
      return { ...state, colors: action.theme.colors };

    default:
      return state;
  }
};

export default reducer;
