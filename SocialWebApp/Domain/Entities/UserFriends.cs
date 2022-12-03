using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class UserFriends
{
  public int Id { get; set; }
  public DateTime CreatedAt { get; set; }
  public bool IsDeleted { get; set; }


  public int SourceUserId { get; set; }
  public User SourceUser { get; set; }

  public int FriendId { get; set; }
  public User Friend { get; set; }

  public bool Pending { get; set; }
  public bool IsHide { get; set; }
}