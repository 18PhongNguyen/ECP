using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

internal class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddDbContext<StoreContext>(x => x.UseSqlite(GetConnectionString()));
        builder.Services.AddScoped<IProductRepository, ProductRepository>();

        string GetConnectionString()
        {
            return builder.Configuration.GetConnectionString("DefaultConnection");
        }

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
                await StoreContextSeed.SeedAsync(context,loggerFactory);
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<Program>();
                logger.LogError(ex, "An error occured during migration");
            }
        }

        // Configure the HTTP request pipeline.
        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }
}