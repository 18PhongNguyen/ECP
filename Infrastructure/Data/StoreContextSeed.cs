using System.Text.Json;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context,ILoggerFactory loggerFactory)
        {
            try
            {
                if(!context.productBrands.Any())
                {
                    var brandsData = 
                        File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");

                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);

                    foreach(var item in brands)
                    {
                        context.productBrands.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if(!context.DeliveryMethods.Any())
                {
                    var dmData = 
                        File.ReadAllText("../Infrastructure/Data/SeedData/delivery.json");

                    var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);

                    foreach(var item in methods)
                    {
                        context.DeliveryMethods.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if(!context.productTypes.Any())
                {
                    var typesData = 
                        File.ReadAllText("../Infrastructure/Data/SeedData/types.json");

                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);

                    foreach(var item in types)
                    {
                        context.productTypes.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if(!context.Products.Any())
                {
                    var productsData = 
                        File.ReadAllText("../Infrastructure/Data/SeedData/products.json");

                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                    foreach(var item in products)
                    {
                        context.Products.Add(item);
                    }

                    await context.SaveChangesAsync();
                }
            }
            catch(Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }

        public static async Task ClearAndReseedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                // Clear existing data
                context.Products.RemoveRange(context.Products);
                context.productTypes.RemoveRange(context.productTypes);
                context.productBrands.RemoveRange(context.productBrands);
                await context.SaveChangesAsync();

                // Reseed all data
                await SeedBrandsAsync(context);
                await SeedTypesAsync(context);
                await SeedProductsAsync(context);
            }
            catch(Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }

        private static async Task SeedBrandsAsync(StoreContext context)
        {
            var brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
            var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
            foreach(var item in brands)
            {
                context.productBrands.Add(item);
            }
            await context.SaveChangesAsync();
        }

        private static async Task SeedTypesAsync(StoreContext context)
        {
            var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
            var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
            foreach(var item in types)
            {
                context.productTypes.Add(item);
            }
            await context.SaveChangesAsync();
        }

        private static async Task SeedProductsAsync(StoreContext context)
        {
            var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
            var products = JsonSerializer.Deserialize<List<Product>>(productsData);
            foreach(var item in products)
            {
                context.Products.Add(item);
            }
            await context.SaveChangesAsync();
        }
    }
}