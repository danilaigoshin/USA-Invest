import { Colors, Modal, StockHistory, User } from './data.interfaces';

export enum actionTypes {
  LOAD_USER = 'LOAD_USER',
  LOGOUT_USER = 'LOGOUT_USER',
  CHANGE_THEME = 'CHANGE_THEME',
  CHANGE_MODAL = 'CHANGE_MODAL',
  ADD_STOCK_HISTORY = 'ADD_STOCK_HISTORY',
  DELETE_STOCK_HISTORY = 'DELETE_STOCK_HISTORY',
}

export type Action =
  | LoadUser
  | ChangeTheme
  | ChangeModal
  | AddStockHistory
  | DeleteStockHistory
  | LogoutUser;

export interface AddStockHistory {
  type: actionTypes.ADD_STOCK_HISTORY;
  stocks: StockHistory[];
}

export interface DeleteStockHistory {
  type: actionTypes.DELETE_STOCK_HISTORY;
  stock: StockHistory;
}

export interface LoadUser {
  type: actionTypes.LOAD_USER;
  data: User;
}

export interface LogoutUser {
  type: actionTypes.LOGOUT_USER;
  data: null;
}

export interface ChangeTheme {
  type: actionTypes.CHANGE_THEME;
  theme: Colors;
}

export interface ChangeModal {
  type: actionTypes.CHANGE_MODAL;
  modal: Modal;
}
