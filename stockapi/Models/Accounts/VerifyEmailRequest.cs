using System.ComponentModel.DataAnnotations;

namespace stockapi.Models.Accounts
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}