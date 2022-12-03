using Application.Common.Models;
using Domain.Entities;

namespace Application.Common.Interfaces;

public interface IChatHub
{
    Task MessageReceivedFromHub(Message message);

    Task NewUserConnected(string message);

}