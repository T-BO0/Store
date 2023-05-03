using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }


        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasket()
        {
            var basket = await RetriveBasket(GetBuyerId());

            if (basket == null)
                return NotFound("no basket found");
            return basket.MapBasketToDto();
        }


        [HttpPost]
        public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetriveBasket(GetBuyerId());
            if (basket == null)
                basket = CreateBasket();

            var product = await _context.Products.FindAsync(productId);
            if(product == null)
                return BadRequest( new ProblemDetails{Title = "Product Not Found"});

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if(result)
                return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

            return BadRequest(new ProblemDetails{Title = "problem saving item to basket"});
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetriveBasket(GetBuyerId());
            if(basket == null)
                return NotFound("no basket found");
            basket.RemoveItem(productId,quantity);

            var result = await _context.SaveChangesAsync() > 0;
            if(result)
                return Ok();

            return BadRequest(new ProblemDetails{Title = "problem removing item from basket"});
        }



        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookiOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId",buyerId, cookiOptions);
            }

            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }

        private async Task<Basket> RetriveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

    }
}