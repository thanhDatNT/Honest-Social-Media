using Application.Common.Models;
using Application.Common.Exceptions;
using Application.Users.Commands.CreateUser;
using Application.Users.Commands.RefreshToken;
using Application.Users.Queries.Login;
using Domain.Common.Errors;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers;

public class AuthController : ApiControllerBase
{
    private readonly ISender _mediator;

    public AuthController(ISender mediator)
    {
        _mediator = mediator;
    }
    
    // POST
    [HttpPost("register")]
    public async Task<ActionResult<NewUserVm>> Register(NewUserDto newUserDto)
    {
        try
        {
            var newUser = await _mediator.Send(new RegisterCommand() { NewUserDto = newUserDto });
            if (newUser == null)
            {
                return StatusCode(503);
            }

            return Ok(newUser);
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Errors);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<AuthenticationResult>> Login(LoginQuery request)
    {
        var authenticationResult = await _mediator.Send(request);

        if (authenticationResult.IsError && authenticationResult.FirstError == AuthenticationError.InvalidCredentials)
        {
            return Unauthorized();
        }
        return Ok(authenticationResult.Value);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthenticationResult>> Refresh(RefreshTokenCommand command)
    {
        if (command is null)
            return BadRequest("Invalid client request");

        var refreshTokenResult = await _mediator.Send(command);
        if (refreshTokenResult.IsError && refreshTokenResult.FirstError == AuthenticationError.InvalidCredentials)
        {
            return Unauthorized();
        }

        return Ok(refreshTokenResult.Value);
    }
}