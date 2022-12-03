using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public byte[]? PasswordHash { get; set; }
    public byte[]? PasswordSalt { get; set; }
    public DateTime Dob { get; set; }
    public string Email { get; set; }
    public string? Avatar { get; set; }
    public string? Cover { get; set; }
    public int Gender { get; set; }
    public string PhoneNo { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;


    [InverseProperty("Sender")]
    public List<Message>? MessagesSend { get; set; }

    [InverseProperty("Receiver")]
    public List<Message>? MessagesReceive { get; set; }

    [InverseProperty("Friend")]
    public List<UserFriends>? Friends { get; set; }

    public List<Comment>? Comments { get; set; }

    public List<Post>? Posts { get; set; }

    [InverseProperty("User")]
    public List<Notification>? UserNotifications { get; set; }

    [InverseProperty("TriggerUser")]
    public List<Notification>? UserTriggerNotifications { get; set; }

  public string? RefreshToken { get; set; }
  public DateTime? RefreshTokenExpiryTime { get; set; }
  public List<PostLike>? PostLikes { get; set; }
}