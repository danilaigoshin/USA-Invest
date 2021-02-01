import { AppState, Action, actionTypes } from '../interfaces';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
  modalOpen: false,
  currentModal: '',
};

const reducer = (
  state = initialState,
  action: Action | { type: typeof HYDRATE; payload: AppState }
) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.modal };

    case actionTypes.CHANGE_MODAL:
      return {
        ...state,
        modalOpen: action.modal.modalOpen,
        currentModal: action.modal.currentModal,
      };

    default:
      return state;
  }
};

export default reducer;
