import { actionTypes, StockHistory } from '../interfaces';
import * as actionIs from '../interfaces/actions.interfaces';

export const addStockHistory = (
  addStock: StockHistory,
  currentStocks: StockHistory[]
): actionIs.AddStockHistory => {
  const indexSame = currentStocks.findIndex(
    (currentStock) => currentStock.ticker === addStock.ticker
  );

  if (indexSame !== -1) {
    currentStocks.splice(indexSame, 1);
    currentStocks.unshift(addStock);

    return {
      type: actionTypes.ADD_STOCK_HISTORY,
      stocks: currentStocks,
    };
  } else {
    const stocks = [addStock, ...currentStocks];

    if (currentStocks.length === 4) {
      stocks.splice(3, 1);
    }

    return {
      type: actionTypes.ADD_STOCK_HISTORY,
      stocks,
    };
  }
};

export const deleteStockHistory = (
  stockToDelete: StockHistory
): actionIs.DeleteStockHistory => {
  return {
    type: actionTypes.DELETE_STOCK_HISTORY,
    stock: stockToDelete,
  };
};
