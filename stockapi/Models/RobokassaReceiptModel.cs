namespace stockapi.Models
{
    public class RobokassaReceiptModel
    {
        public RobokassaItemModel[] items { get; set; }
    }

    public class RobokassaItemModel
    {
        public string name { get; set; }
        public int quantity { get; set; }
        public int sum { get; set; }
        public string tax { get; set; }
        public string payment_method { get; set; }
        public string payment_object { get; set; }
        public string nomenclature_code { get; set; }
    }

}
