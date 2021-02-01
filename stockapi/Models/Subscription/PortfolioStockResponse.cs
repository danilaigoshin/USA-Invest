using System;

namespace stockapi.Models.Subscription
{
    public class PortfolioStockResponse
    {
        public string Company { get; set; }
        public string Sector { get; set; }
        public bool IsDividend { get; set; }
        public string Ticker { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
    }
}
