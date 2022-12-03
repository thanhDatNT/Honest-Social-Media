using Application.Users.Queries.GetUserInfo;

namespace Application.Messages.Queries.GetUserMessage;

public class UserMessageDto
{
    public int Id { get; set; }
    public string Content { get; set; }
    public int Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }

    public int SenderId { get; set; }
    public UserDto Sender { get; set; }

    public int ReceiverId { get; set; }
    public UserDto Receiver { get; set; }

    public bool IsTransmit { get; set; } = true;
}