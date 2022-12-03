using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.SignalR;

namespace Application.Common.Models;

public class ChatHub:Hub<IChatHub>
{
    public async Task AddUserToGroupAsync(int groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName.ToString());
    }
    public async Task BroadcastAsync(Message message)
    {
        await Clients.All.MessageReceivedFromHub(message);
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.All.NewUserConnected("a new user connected");
    }
}