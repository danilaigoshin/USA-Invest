using System.ComponentModel.DataAnnotations;

namespace stockapi.Models.Accounts
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}