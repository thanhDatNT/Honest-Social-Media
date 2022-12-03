using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;
public class Message
{
  public int Id { get; set; }
  public string Content { get; set; }
  public int Type { get; set; }
  public DateTime CreatedAt { get; set; }
  public bool IsRead { get; set; }

  public int SenderId { get; set; }
  public User? Sender { get; set; }

  public int ReceiverId { get; set; }
  public User? Receiver { get; set; }

  public bool IsDeleted { get; set; } = false;
}
