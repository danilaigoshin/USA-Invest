using System.Text.Json;

namespace stockapi.Models
{
    public class CompanyGurufocusModel
    {
        public string type { get; set; }
        public JsonElement data { get; set; }
    }
}
