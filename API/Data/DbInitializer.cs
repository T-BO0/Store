using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                };

                await userManager.CreateAsync(user,"Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] {"Member", "Admin"});
            }

            if(context.Products.Any()) return;

            var products = new List<Product>
            {
                new Product
                {
                    Name = "AlpinePulse Speedster Board 2000",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 20000,
                    PictureUrl = "/images/products/alpinePulseBoards.jpg",
                    Brand = "AlpinePulse",
                    Type = "Boards",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "FrostFlex Board 3000",
                    Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                    Price = 15000,
                    PictureUrl = "/images/products/frostFlexBoards.jpg",
                    Brand = "FrostFlex",
                    Type = "Boards",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "FrostTopGear Speed Rush 3",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 18000,
                    PictureUrl = "/images/products/frostTopGearBoards.jpg",
                    Brand = "FrostTopGear",
                    Type = "Boards",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "GlacierGlide Super Board",
                    Description =
                        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                    Price = 30000,
                    PictureUrl = "/images/products/glacierGlideBoards.png",
                    Brand = "GlacierGlide",
                    Type = "Boards",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "PowderPeak Super Whizzy Fast",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 25000,
                    PictureUrl = "/images/products/powderPeakBoards.jpg",
                    Brand = "PowderPeak",
                    Type = "Boards",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "SummitForge S-1000",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 12000,
                    PictureUrl = "/images/products/summitForgeBoards.jpg",
                    Brand = "SummitForge",
                    Type = "Boards",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "AlpinePulse Red Hat",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1000,
                    PictureUrl = "/images/products/alpinePulseHat.jpg",
                    Brand = "AlpinePulse",
                    Type = "Hats",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "FrostFlex Red Woolen Hat",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 8000,
                    PictureUrl = "/images/products/frostFlexHat.jpg",
                    Brand = "FrostFlex",
                    Type = "Hats",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Blue FrostTopGear Woolen Hat",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1500,
                    PictureUrl = "/images/products/frostTopGearHat.jpg",
                    Brand = "FrostTopGear",
                    Type = "Hats",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Gray FrostFlex Gloves",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1800,
                    PictureUrl = "/images/products/frostFlexGloves.jpg",
                    Brand = "FrostFlex",
                    Type = "Gloves",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Black AlpinePulse Gloves",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1500,
                    PictureUrl = "/images/products/alpinePulseGloves.jpg",
                    Brand = "AlpinePulse",
                    Type = "Gloves",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Yellow PowderPeak Gloves",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1600,
                    PictureUrl = "/images/products/powderPeakGloves.jpg",
                    Brand = "PowderPeak",
                    Type = "Gloves",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Blue SummiteForge Gloves",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1400,
                    PictureUrl = "/images/products/summitForgeGloves.jpg",
                    Brand = "SummitForge",
                    Type = "Gloves",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "AlpinePulse Blue Boots",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 25000,
                    PictureUrl = "/images/products/alpinePulseBoots.jpg",
                    Brand = "AlpinePulse",
                    Type = "Boots",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "FrostTopGear White Boots",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 18999,
                    PictureUrl = "/images/products/frostTopGearBoots.jpg",
                    Brand = "FrostTopGear",
                    Type = "Boots",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "GlacierGlide Blue Boots",
                    Description =
                        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                    Price = 19999,
                    PictureUrl = "/images/products/glacierGlideBoots.jpg",
                    Brand = "GlacierGlide",
                    Type = "Boots",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Dark PowderPeak Boots",
                    Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                    Price = 15000,
                    PictureUrl = "/images/products/powderPeakBoots.jpg",
                    Brand = "PowderPeak",
                    Type = "Boots",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Gray SummitForge Boots",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 18000,
                    PictureUrl = "/images/products/summitForgeBoots.jpg",
                    Brand = "SummitForge",
                    Type = "Boots",
                    QuantityInStock = 100
                },
            };

            foreach (var product in products)
            {
                context.Products.Add(product);
            }

            context.SaveChanges();
        }
    }
}