using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using StackExchange.Redis;

internal class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddDbContext<StoreContext>(x => x.UseSqlite(GetConnectionString(builder.Configuration)));
        builder.Services.AddSingleton<IConnectionMultiplexer>(c => {
            var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
            var configuration = ConfigurationOptions.Parse(redisConnectionString,true);
            return ConnectionMultiplexer.Connect(configuration);
        });
        builder.Services.AddAutoMapper(typeof(MappingProfiles));
        builder.Services.AddApplicationServices();
        builder.Services.AddSwaggerDocumentation();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowLocalhost", policy =>
        {
            policy.WithOrigins("https://localhost:4200")  
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
        

        // Configure Kestrel
        builder.WebHost.ConfigureKestrel(serverOptions =>
        {
            serverOptions.ListenAnyIP(5194); // HTTP
            serverOptions.ListenAnyIP(5001, listenOptions => listenOptions.UseHttps()); // HTTPS
        });

        var app = builder.Build();

        await using (var scope = app.Services.CreateAsyncScope())
        {
            var services = scope.ServiceProvider;
            var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            try
            {
                var context = services.GetRequiredService<StoreContext>();
                await context.Database.MigrateAsync();
                await StoreContextSeed.SeedAsync(context, loggerFactory);
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<Program>();
                logger.LogError(ex, "An error occurred during migration");
            }
        }

        app.UseMiddleware<ExceptionMiddleware>();
        app.UseStatusCodePagesWithReExecute("/errors/{0}");

        // Configure the HTTP request pipeline.
        app.UseCors("AllowLocalhost");
        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseStaticFiles();
        app.UseAuthorization();
        app.UseSwaggerDocumentation();
        app.MapControllers();
        app.Run();
    }

    private static string GetConnectionString(IConfiguration configuration)
    {
        return configuration.GetConnectionString("DefaultConnection");
    }
}