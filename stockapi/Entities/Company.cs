using System.Text.Json.Serialization;

namespace stockapi.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Ticker { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Sector { get; set; }
        [JsonIgnore]
        public string Category { get; set; }
        public string LogoUrl { get; set; }
        public double Price { get; set; }
        public StockFutureForecast FutureForecast { get; set; }
        public string Status { get; set; }
        public int FinancialStrength { get; set; }
        public int ProfitabilityRank { get; set; }
        public int ValuationRank { get; set; }
        public string StockId { get; set; }
    }

    public class StockFutureForecast
    {
        [JsonIgnore]
        public int Id { get; set; }
        public string Date { get; set; }
        public int PriceDifference { get; set; }
    }
}
