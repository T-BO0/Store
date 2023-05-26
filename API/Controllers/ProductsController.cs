using System.Net;
using System.Text.Json;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imgService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imgService)
        {
            _imgService = imgService;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductsParams productsParams)
        {
            var query = _context.Products
            .Sort(productsParams.OrderBy)
            .Search(productsParams.SearchTerm)
            .Filter(productsParams.Brands, productsParams.Types)
            .AsQueryable();

            var products  = await PagedList<Product>.ToPagedList(query, productsParams.PageNumber, productsParams.PageSize);
            
            Response.AddPaginationHeader(products.MetaData);
            return products;
        }

        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product is null)
                return NotFound();
            
            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDTO productDTO)
        {
            var product = _mapper.Map<Product>(productDTO);

            if(productDTO.File != null)
            {
                var imageResult = await _imgService.AddImageAsync(productDTO.File);

                if(imageResult.Error != null) return BadRequest (new ProblemDetails{Title = imageResult.Error.Message});

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }
            
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);

            return BadRequest(new ProblemDetails{ Title = "Problem creating new product"});
        }


        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDTO productDTO)
        {
            var product = await _context.Products.FindAsync(productDTO.Id);

            if(product == null) return NotFound();

            _mapper.Map(productDTO, product);

            if(productDTO.File != null)
            {
                var imageResult = await _imgService.AddImageAsync(productDTO.File);

                if(imageResult.Error != null) return BadRequest (new ProblemDetails{Title = imageResult.Error.Message});

                if(!string.IsNullOrEmpty(product.PublicId)) await _imgService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok(product);

            return BadRequest(new ProblemDetails{ Title="problem updating product" });
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product == null) return NotFound();

            if(!string.IsNullOrEmpty(product.PublicId)) await _imgService.DeleteImageAsync(product.PublicId);

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok();

            return BadRequest(new ProblemDetails{Title="problem deliting product"});
        }
    }
}