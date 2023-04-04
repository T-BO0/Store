using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuggyController : BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound() => NotFound();
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() => BadRequest(new ProblemDetails{Title = "This is a bad request"});
        [HttpGet("unauthorized")]
        public ActionResult GetUnauthorized() => Unauthorized();
        [HttpGet("validation-error")]
        public ActionResult ValidationError()
        {
            ModelState.AddModelError("problem1", "this is the first error");
            ModelState.AddModelError("problem2", "this is the second error");

            return ValidationProblem();
        }
        [HttpGet("server-error")]
        public ActionResult GetServerError() => throw new Exception("this is server error");
    }
}