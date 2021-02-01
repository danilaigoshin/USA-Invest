using System;

namespace stockapi.Entities
{
    public class Subscription
    {
        public int Id { get; set; }
        public string OrderId { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; }
        public int Duration { get; set; }
        public int Cost { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public bool IsPaid => PaymentDate.HasValue;
    }
}
