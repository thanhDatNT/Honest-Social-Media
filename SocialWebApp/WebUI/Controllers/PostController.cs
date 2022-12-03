using Application.Common.Exceptions;
using Application.Common.Models;
using Application.Posts.Commands.CommentPost;
using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.DeletePost;
using Application.Posts.Commands.LikePost;
using Application.Posts.Queries;
using Application.Posts.Queries.GetPersonalPosts;
using Application.Posts.Queries.GetNewsfeedPosts;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;


namespace WebUI.Controllers;

public class PostController : ApiControllerBase
{
    [HttpGet("{userId}")]
    public async Task<ActionResult<PaginatedPostDto>> GetUserPosts(int userId, int offset = 0, int limit = 100)
    {
        try
        {
            return await Mediator.Send(new GetPersonalPostsQuery() { UserId = userId, Offset = offset, Limit = limit });
        }
        catch (NotFoundException e)
        {
            return NotFound();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
   
    }

    [HttpPost("like")]
    public async Task<ActionResult<PostDto>> LikePost(int postId, int userId,LikeStatus status)
    {
        try
        {
            return await Mediator.Send(new LikePostCommand() { PostId = postId, UserId = userId,Status=status });
        }
        catch (NotFoundException e)
        {
            return NotFound();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }


    [HttpGet("newsfeed/{userId}")]
    public async Task<ActionResult<PaginatedPostDto>> GetNewsfeedPosts(int userId, int offset = 0, int limit = 100)
    {
        try
        {
            return await Mediator.Send(new GetPostsQuery() { UserId = userId, Offset = offset, Limit = limit });
        }
        catch (NotFoundException e)
        {
            return NotFound();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }

    [HttpPost("create")]
    public async Task<ActionResult<bool>> CreatePost([FromForm] ICollection<IFormFile> files,[FromForm]int userId,[FromForm]string? status="")
    {
        try
        {
            List<FileDto> fileDtos = new List<FileDto>();
            foreach (var file in files)
            {
                var fileDto = new FileDto
                {
                    Content = file.OpenReadStream(),
                    Name = file.FileName,
                    ContentType = file.ContentType,
                };
                fileDtos.Add(fileDto);
            }

            var result = await Mediator.Send(new CreatePostCommand(userId, fileDtos, status));
            return result;
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }

    [HttpDelete("delete/{userId}")]
    public async Task<ActionResult<PaginatedPostDto>> DeletePost(int userId, int postId)
    {
        try
        {
            if (userId == null || postId == null) return BadRequest();
            return await Mediator.Send(new DeletePostCommand(postId, userId));
        }
        catch (NotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
    
    [HttpPut("comment/{userId}")]
    public async Task<ActionResult<PostDto>> CommentPost(int userId, int postId,[FromBody] string content)
    {
        try
        {
            return Ok(await Mediator.Send(new CommentPostCommand(content, postId, userId)));
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Message);
        }
        catch (NotFoundException e)
        {
            return NotFound();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
}