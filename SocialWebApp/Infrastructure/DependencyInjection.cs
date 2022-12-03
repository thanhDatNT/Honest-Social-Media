using System.Text;
using Application.Common.Interfaces;
using Infrastructure.Authentication;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Infrastructure.File;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public static class DependencyInjection
{
  public static IServiceCollection AddInfrastructure(this IServiceCollection services, ConfigurationManager configuration)
  {
    services.AddDbContext<AppDbContext>(x => x.UseSqlServer(configuration.GetConnectionString("SqlServer")));
    services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<AppDbContext>());
    services.AddAuth(configuration);
    services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
    return services;
  }

  public static IServiceCollection AddAuth(this IServiceCollection services, ConfigurationManager configuration)
  {
    var jwtSettings = new JwtSettings();
    configuration.Bind(JwtSettings.SectionName, jwtSettings);
    var blobStorageSettings = new BlobStorageSettings();
    configuration.Bind(BlobStorageSettings.SectionName, blobStorageSettings);
    services.AddSingleton(Options.Create(jwtSettings));
    services.AddSingleton<IIdentityService, IdentityServices>();
    services.AddSingleton(x => new BlobServiceClient(blobStorageSettings.ConnectionString));
    services.AddScoped<IFileStorageService, FileStorageService>(); 
    services.AddAuthentication(defaultScheme: JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            ClockSkew = TimeSpan.Zero
          };

          options.Events = new JwtBearerEvents()
          {
            OnMessageReceived = context =>
            {
              var accessToken = context.Request.Query["access_token"];
              var path = context.HttpContext.Request.Path;
              if (!string.IsNullOrEmpty(accessToken) &&
                  (path.StartsWithSegments("/notificationService")))
              {
                context.Token = accessToken;
              }
              return Task.CompletedTask;
            }
          };
        });
    return services;
  }
}