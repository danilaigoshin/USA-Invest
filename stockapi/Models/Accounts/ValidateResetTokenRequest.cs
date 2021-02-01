using System.ComponentModel.DataAnnotations;

namespace stockapi.Models.Accounts
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}