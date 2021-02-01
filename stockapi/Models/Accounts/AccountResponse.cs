using System;

namespace stockapi.Models.Accounts
{
    public class AccountResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string LoginMethod { get; set; }
        public string SubscriptionEndDate { get; set; }
        public string ExternalPhotoLink { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool IsVerified { get; set; }
    }
}