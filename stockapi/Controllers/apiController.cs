using Microsoft.AspNetCore.Mvc;

namespace api.Controllers {
    public class apiController : ControllerBase {

        [HttpPost]
        public string Index (string Text) 
        {
            return Text;
        }

        [HttpGet]
        public string Index () 
        {
            return "Text";
        }
    }
}