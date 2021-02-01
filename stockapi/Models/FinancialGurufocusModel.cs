namespace stockapi.Models
{
    public class FinYearGurufocusModel
    {
        public int startYear { get; set; }
        public double[] RevenueData { get; set; }
        public double[] IncomeData { get; set; }
        public double[] CashData { get; set; }
        public double[] DebtData { get; set; }
    }
    public class FinQuartGurufocusModel
    {
        public string [] Quarterly { get; set; }
        public double[] RevenueData { get; set; }
        public double[] IncomeData { get; set; }
        public double[] CashData { get; set; }
        public double[] DebtData { get; set; }

    }
}
