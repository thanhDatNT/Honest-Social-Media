using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext, IApplicationDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    { }

    public DbSet<User> User { get; set; }
    public DbSet<UserFriends> UserFriends { get; set; }
    public DbSet<Post> Post { get; set; }
    public DbSet<Comment> Comment { get; set; }
    public DbSet<Message> Message { get; set; }
    public DbSet<Notification> Notification { get; set; }
    public DbSet<Photo> Photo { get; set; }
    
    public DbSet<PostLike> PostLike { get; set; }
    public DbSet<PostPhoto> PostPhoto { get; set; }

    public int SaveChanges()
    {
        return base.SaveChanges();
    }

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // {
    //      optionsBuilder.UseSqlServer("Server=social-intern-orient.database.windows.net;Database=socialDB;User=intern_orient;Password=Pass123$;TrustServerCertificate=True");
    // }
    
    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {
        foreach (var relationship in modelbuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.NoAction;
        }
        
        base.OnModelCreating(modelbuilder);
    }
    public async Task<int> SaveChangesAsync()
    {
        return await base.SaveChangesAsync();
    }
}
