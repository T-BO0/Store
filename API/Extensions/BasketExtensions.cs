using API.DTOS;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDTO MapBasketToDto(this Basket basket)
        {
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
                Items = basket.Items.Select(item => new BasketItemDTO
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity,

                }).ToList(),
            };
        }

        public static IQueryable<Basket> RetriveBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query.Include(i => i.Items).ThenInclude(p => p.Product).Where(x => x.BuyerId == buyerId);
        }
    }
}