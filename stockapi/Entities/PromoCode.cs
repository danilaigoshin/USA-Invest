using System;

namespace stockapi.Entities
{
    public class PromoCode
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int AdditionalDays { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}
