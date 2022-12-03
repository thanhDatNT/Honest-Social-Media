using Application.Common.Exceptions;
using Application.Photos.Queries.GetPhotoByUserQuery;
using Application.Posts.Queries.GetPersonalPosts;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class PhotoController : ApiControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PhotoVm>> GetUserPhotos([FromQuery] GetPhotoByUserQuery query)
        {
            try
            {
                return await Mediator.Send(query);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ValidationException e)
            {
                return BadRequest(e.Errors);
            }
        }
    }
}
