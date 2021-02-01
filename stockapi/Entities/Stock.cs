using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace stockapi.Entities
{
    [Owned]
    public class Stock
    {
        [Key]
        public int Id { get; set; }
        public string Company { get; set; }
        public string Sector { get; set; }
        public bool IsDividend { get; set; }
        public string Ticker { get; set; }
        public int Amount { get; set; }
    }
}
