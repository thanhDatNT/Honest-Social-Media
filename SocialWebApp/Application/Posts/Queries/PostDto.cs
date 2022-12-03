using Application.Users.Queries.GetUserInfo;
using Domain.Entities;

namespace Application.Posts.Queries;

public class PostDto
{
  public int Id { get; set; }
  public string? Status { get; set; }
  public List<PostPhoto>? Photos { get; set; }
  public int NumberOfLikes { get; set; }
  public int NumberOfComments { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
  public List<Comment>? Comments { get; set; }
  public int UserId { get; set; }
  public UserDto User { get; set; }
  public List<PostLike>? PostLikes { get; set; }
}