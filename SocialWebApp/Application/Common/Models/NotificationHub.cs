using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Application.Common.Models
{
    public class NotificationHub : Hub<INotificationHub>
    {
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{Context.UserIdentifier}");
            await base.OnConnectedAsync();
        }
    }
}
