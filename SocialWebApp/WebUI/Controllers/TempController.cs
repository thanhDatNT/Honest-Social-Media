using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    // [AllowAnonymous]
    [ApiController]
    public class TempController : ApiControllerBase
    {
        [HttpGet]
        public IActionResult List()
        {
            return Ok(Array.Empty<string>());
        }
    }
}
