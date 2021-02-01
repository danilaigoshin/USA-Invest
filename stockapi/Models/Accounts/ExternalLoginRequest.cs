using stockapi.Entities;

namespace stockapi.Models.Accounts
{
    public class ExternalLoginRequest
    {
        public string ExternalUserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string ExternalPhotoLink { get; set; }
        public string Provider { get; set; }
    }
}
