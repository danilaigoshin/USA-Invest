import { AppState, Action, actionTypes } from '../interfaces';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
  user: null,
};

const reducer = (
  state = initialState,
  action: Action | { type: typeof HYDRATE; payload: AppState }
) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.auth };

    case actionTypes.LOAD_USER:
      return { ...state, user: action.data };

    case actionTypes.LOGOUT_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

export default reducer;
