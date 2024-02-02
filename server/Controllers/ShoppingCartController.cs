using EDP_Project.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication1;
using WebApplication1.Models;

namespace EDP_Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShoppingCartController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ShoppingCartController(MyDbContext context)
        {
            _context = context;
        }

        private static readonly List<ShoppingCart> list = new();

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var result = _context.ShoppingCarts
                    .Include(s => s.Schedule)
                    .Where(s => s.Schedule.IsDeleted == false)
                    .OrderByDescending(x => x.itemID)
                    .Select(cart => new
                    {
                        cart.itemID,
                        cart.Quantity,
                        cart.DateCart,
                        EventName = cart.Schedule.Title,
                        EventPrice = cart.Schedule.Price
                        // Include other properties you need
                    })
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("{id}")]
        public IActionResult AddToCart(int id,ShoppingCart shoppingCart)
        {

            // Add the shopping cart item
            var myShoppingCart = new ShoppingCart()
            {
                Quantity = shoppingCart.Quantity,
                DateCart = DateTime.Now, // Use the current timestamp
                ScheduleId = id,
                UserId = 1
            };

            try
            {
                _context.ShoppingCarts.Add(myShoppingCart);
                _context.SaveChanges();
                return Ok(myShoppingCart);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, "Failed to add item to cart: " + ex.Message);
            }
        }


        [HttpPut("{id}")]
        public IActionResult UpdateCart(int id, ShoppingCart shoppingCart)
        {
            var myShoppingCart = _context.ShoppingCarts.Find(id);
            if (myShoppingCart == null)
            {
                return NotFound();
            }
            myShoppingCart.Quantity = shoppingCart.Quantity;

            _context.SaveChanges();
            return Ok();
        }


[HttpDelete("{userId}")]
    public IActionResult DeleteShoppingCartForUser(int userId)
    {
        // Find all shopping cart items associated with the specified userId
        var shoppingCarts = _context.ShoppingCarts.Where(cart => cart.UserId == userId).ToList();

        // Check if there are any shopping cart items for the user
        if (shoppingCarts == null || !shoppingCarts.Any())
        {
            return NotFound("No shopping cart items found for the user.");
        }

        // Remove all shopping cart items associated with the user
        _context.ShoppingCarts.RemoveRange(shoppingCarts);
        _context.SaveChanges();

        return Ok("Shopping cart items deleted successfully for the user.");
    }


        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession()
        {
            var domain = "http://localhost:7051"; //changed from 7104 

            try
            {
                // Retrieve cart items from the database where associated event is not deleted
                List<ShoppingCart> cartItems = _context.ShoppingCarts
                    .Include(s => s.Schedule)
                    .Where(s => !s.Schedule.IsDeleted) // Filter by IsDeleted property of the associated event
                    .ToList();

                // Build line items for the session
                var lineItems = cartItems.Select(item => new SessionLineItemOptions
                {
                    Price = "price_1OfBk0E7dlDzSq3b3wIjyDuf", // Price ID for the product
                    Quantity = item.Quantity
                }).ToList();

                var options = new SessionCreateOptions
                {
                    LineItems = lineItems,
                    Mode = "payment",
                    SuccessUrl = "http://localhost:3000/successfulpayment",
                    CancelUrl = "http://localhost:3000/shoppingcart"
                };

                var service = new SessionService();
                Session session = service.Create(options);

                // Return the URL without redirecting
                return Ok(new { url = session.Url });
            }
            catch (Exception ex)
            {
                // Handle errors
                return BadRequest(new { error = "Failed to create checkout session", message = ex.Message });
            }
        }




    }
}
