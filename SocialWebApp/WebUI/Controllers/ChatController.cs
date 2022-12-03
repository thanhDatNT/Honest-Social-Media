using Application.Common.Exceptions;
using Application.Common.Models;
using Application.Messages.Commands.AddFile;
using Application.Messages.Commands.AddMessage;
using Application.Messages.Commands.HideMessage;
using Application.Messages.Commands.UpdateMessageStatus;
using Application.Messages.Queries.GetUserMessage;
using Application.Messages.Queries.GetUsersMessage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebUI.Controllers;

public class ChatController : ApiControllerBase
{
    private readonly IHubContext<ChatHub> hubContext;

    public ChatController(IHubContext<ChatHub> hubContext)
    {
        this.hubContext = hubContext;
    }


    [HttpGet]
    public async Task<IActionResult> UserMessage([FromQuery] GetUserMessageQuery command)
    {
        try
        {
            return Ok(await Mediator.Send(command));
        }
        catch (ValidationException e)
        {
            return BadRequest(e);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500);
            ;
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> UsersMessage([FromQuery] GetUsersMessageQuery command)
    {
        try
        {
            return Ok(await Mediator.Send(command));
        }
        catch (ValidationException e)
        {
            return BadRequest(e);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }


    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] AddMessageCommand command)
    {
        try
        {
            var message = await Mediator.Send(command);
            if (message.IsTransmit)
            {
                await hubContext.Clients.Group(command.ReceiverId.ToString())
                    .SendAsync("messageReceivedFromApi", message);
            }
              
            return Ok(message);
        }
        catch (ValidationException e)
        {
            return BadRequest(e);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500);
        }
    }

    [HttpPost("file")]
    public async Task<IActionResult> SendFile([FromForm] AddFileCommand command)
    {
        try
        {
            var messageDto = await Mediator.Send(command);
            if (messageDto.IsTransmit)
            {
                await hubContext.Clients.Group(command.ReceiverId.ToString())
                    .SendAsync("messageReceivedFromApi", messageDto);

            }
            return Ok(messageDto);
        }
        catch (ValidationException e)
        {
            return BadRequest(e);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500);
        }
    }

    [HttpPut()]
    public async Task<IActionResult> UpdateReadStatus([FromQuery] UpdateMessageStatusCommand command)
    {
        try
        {
            await Mediator.Send(command);
            return Ok();
        }
        catch (ValidationException e)
        {
            return BadRequest(e);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500);
        }
    }
    [HttpPut("hide")]
    public async Task<IActionResult> ClearUserMessage(HideMessageCommand command)
    {
        try
        {
            await Mediator.Send(command);
            return Ok();
        }
        catch (ValidationException e)
        {
            return BadRequest(e);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500);
        }
    }
}