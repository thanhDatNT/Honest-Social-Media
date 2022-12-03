namespace Domain.Entities;
public class Notification
{
  public int Id { get; set; }
  public int Type { get; set; }
  public string Content { get; set; }
  public bool IsRead { get; set; }
  public DateTime CreatedAt { get; set; }

  public User User { get; set; }
  public int UserId { get; set; }

  public User TriggerUser { get; set; }
  public int TriggerUserId { get; set; }
}