import { combineReducers } from 'redux';
import auth from './auth';
import theme from './theme';
import modal from './modal';
import stockHistory from './stockHistory';

export default combineReducers({
  auth,
  theme,
  modal,
  stockHistory,
});
