using Domain.Entities;

namespace Application.Common.Models;

public class NotificationDto
{
    public int Type { get; set; }
    public NotificationUserDto TriggerUser { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class NotificationUserDto
{
    public int Id { get; set; }
    public string Avatar { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}