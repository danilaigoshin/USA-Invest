namespace stockapi.Models.Subscription
{
    public class CreatePromoCodeRequest
    {
        public int AdditionalDays { get; set; }
        public string ExpirationDate { get; set; }
    }
}
