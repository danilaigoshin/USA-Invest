import { actionTypes, Modal } from '../interfaces';
import * as actionIs from '../interfaces/actions.interfaces';

export const changeModal = (value: Modal): actionIs.ChangeModal => {
  return {
    type: actionTypes.CHANGE_MODAL,
    modal: value,
  };
};
