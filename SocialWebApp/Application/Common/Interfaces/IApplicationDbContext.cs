using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IApplicationDbContext
{
    public DbSet<User> User { get; set; }
    public DbSet<UserFriends> UserFriends { get; set; }
    public DbSet<Post> Post { get; set; }
    public DbSet<Comment> Comment { get; set; }
    public DbSet<Message> Message { get; set; }
    public DbSet<Notification> Notification { get; set; }
    public DbSet<Photo> Photo { get; set; }
    public DbSet<PostLike> PostLike { get; set; }
    public DbSet<PostPhoto> PostPhoto { get; set; }

    Task<int> SaveChangesAsync();
    public int SaveChanges();
}