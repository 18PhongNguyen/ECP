using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager) 
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "L",
                    Email = "fortest@test.com",
                    UserName = "LTestUser",
                    Address = new Address
                    {
                        FirstName = "L",
                        LastName = "Lid",
                        Street = "none",
                        City = "Hanoi",
                        State = "HN",
                        Zipcode = "000000"
                    }
                };

                await userManager.CreateAsync(user, "P4$$w0rd");
            }
        }
    }
}