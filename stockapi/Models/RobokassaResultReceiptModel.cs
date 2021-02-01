namespace stockapi.Models
{
    public class RobokassaResultReceiptModel
    {
        public string merchantId { get; set; }
        public int id { get; set; }
        public int originId { get; set; }
        public string operation { get; set; }
        public string url { get; set; }
        public int total { get; set; }
        public RobokassaItemModel[] items { get; set; }
        public RobokassaClientModel client { get; set; }
        public RobokassaPaymentModel[] payments { get; set; }
        public RobokassaVatModel[] vats { get; set; }

    }

    public class RobokassaClientModel
    {
        public string email { get; set; }
        public string phone { get; set; }
    }

    public class RobokassaPaymentModel
    {
        public int type { get; set; }
        public int sum { get; set; }
    }

    public class RobokassaVatModel
    {
        public string type { get; set; }
        public int sum { get; set; }
    }
}
