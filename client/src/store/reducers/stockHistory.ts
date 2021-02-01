import { AppState, Action, actionTypes, StockHistory } from '../interfaces';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
  stocks: [],
};

const reducer = (
  state = initialState,
  action: Action | { type: typeof HYDRATE; payload: AppState }
) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.stockHistory };

    case actionTypes.ADD_STOCK_HISTORY:
      return {
        ...state,
        stocks: action.stocks,
      };

    case actionTypes.DELETE_STOCK_HISTORY:
      return {
        ...state,
        stocks: state.stocks.filter(
          (stock: StockHistory) => stock.ticker !== action.stock.ticker
        ),
      };

    default:
      return state;
  }
};

export default reducer;
