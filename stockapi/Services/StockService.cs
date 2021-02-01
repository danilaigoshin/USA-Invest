using AutoMapper;
using stockapi.Entities;
using stockapi.Helpers;
using stockapi.Models.Subscription;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace stockapi.Services
{
    public interface IStockService
    {
        public Task<List<PortfolioStockResponse>> GetInvestmentPortfolio(int accountId);
        public void AddStockToPortfolio(int accountId, Stock stock);
        public void EditStocksInPortfolio(int accountId, Stock stock);
        public void DeleteStockFromPortfolio(int accountId, string ticker);
        public void ClearInvestmentPortfolio(int accountId);
    }

    public class StockService : IStockService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public StockService(
           DataContext context,
           IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task <List<PortfolioStockResponse>> GetInvestmentPortfolio(int accountId)
        {
            var account = GetAccount(accountId);

            List<PortfolioStockResponse> portfolioResponse = new List<PortfolioStockResponse>();
            foreach (var stock in account.InvestmentPortfolio)
            {
                portfolioResponse.Add(_mapper.Map<PortfolioStockResponse>(stock));

                WebRequest request = WebRequest.Create($"https://finnhub.io/api/v1/quote?symbol={stock.Ticker}&token=bvdjkqv48v6p35e0g2sg");
                WebResponse response;
                string result;

                try
                {
                    response = await request.GetResponseAsync();
                    using (Stream stream = response.GetResponseStream())
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            result = reader.ReadToEnd();
                        }
                    }
                    response.Close();

                    using (JsonDocument doc = JsonDocument.Parse(result))
                    {
                        JsonElement root = doc.RootElement;
                        portfolioResponse.Last().Price = root.GetProperty("c").GetDouble();
                    }
                }
                catch
                {
                    throw new AppException("Ошибка при обновлении стоимости акций");
                }
            }

            return portfolioResponse;
        }

        public void AddStockToPortfolio (int accountId, Stock stock)
        {
            var account = GetAccount(accountId);

            if (account.InvestmentPortfolio.Any(x => x.Ticker == stock.Ticker))
                throw new AppException($"Эта акция уже есть в портфеле");

            stock.Amount = 1;
            stock.Ticker = stock.Ticker.ToUpper();
            account.InvestmentPortfolio.Add(stock);

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public void EditStocksInPortfolio(int accountId, Stock stock)
        {
            var account = GetAccount(accountId);

            if (account.InvestmentPortfolio.Any(x => x.Ticker == stock.Ticker))
            {
                account.InvestmentPortfolio.Find(x => x.Ticker == stock.Ticker).Amount = stock.Amount;
            }
            else
            {
                account.InvestmentPortfolio.Add(stock);
            }

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public void DeleteStockFromPortfolio(int accountId, string ticker)
        {
            var account = GetAccount(accountId);

            var deletedStock = account.InvestmentPortfolio.Find(x => x.Ticker == ticker);

            if (deletedStock == null)
                throw new AppException($"Акции {ticker} не найдены");

            account.InvestmentPortfolio.Remove(deletedStock);

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }

        public void ClearInvestmentPortfolio(int accountId)
        {
            var account = GetAccount(accountId);

            account.InvestmentPortfolio.Clear();

            _context.Accounts.Update(account);
            _context.SaveChanges();
        }


        // helper methods

        private Account GetAccount(int id)
        {
            var account = _context.Accounts.Find(id);
            if (account == null) throw new KeyNotFoundException("Аккаунт не найден");
            return account;
        }
    }
}
