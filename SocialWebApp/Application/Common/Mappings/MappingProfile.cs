using Application.Messages.Queries.GetUserMessage;
using Application.Common.Models;
using Application.Posts.Queries;
using Application.Users.Queries.Login;
using Application.Users.Commands.CreateUser;
using Application.Users.Queries.GetUserInfo;
using AutoMapper;
using Domain.Entities;
using Application.Photos.Queries.GetPhotoByUserQuery;
using Application.Users.Queries.SearchFriends;
using Application.Users.Queries.SearchUsers;
using Application.Users.Queries.SearchFriends;

namespace Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<NewUserDto, User>();
            CreateMap<User, NewUserVm>();
            CreateMap<User, LoginUserDto>();
            CreateMap<Message,UserMessageDto>();
            CreateMap<Post, PostDto>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<User, SearchUserDto>();
            CreateMap<User, SearchFriendDto>();
            CreateMap<User, NotificationUserDto>();
            CreateMap<Notification, NotificationDto>();
        }
}