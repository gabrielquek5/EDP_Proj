using EDP_Project.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication1;

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
                    .Include(s => s.Event)
                    .OrderByDescending(x => x.itemID)
                    .Select(cart => new
                    {
                        cart.itemID,
                        cart.Quantity,
                        cart.DateCart,
                        EventName = cart.Event.EventName,
                        EventPrice = cart.Event.EventPrice
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

        [HttpPost]
        public IActionResult AddToCart(ShoppingCart shoppingCart)
        {
            var now = DateTime.Now;
            var myShoppingCart = new ShoppingCart()
            {
                Quantity = shoppingCart.Quantity,
                DateCart = shoppingCart.DateCart,
                EventID = 1,
                UserID=1

            };

            _context.ShoppingCarts.Add(myShoppingCart);
            _context.SaveChanges();

            return Ok(myShoppingCart);
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
        var shoppingCarts = _context.ShoppingCarts.Where(cart => cart.UserID == userId).ToList();

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
            var domain = "http://localhost:7104";

            // Retrieve cart items from the database
            List<ShoppingCart> cartItems = _context.ShoppingCarts.ToList();

            // Build line items for the session
            var lineItems = cartItems.Select(item => new SessionLineItemOptions
            {
                Price = "price_1OefBME7dlDzSq3bRUCnK4Ap", // Price ID for the product
                Quantity = item.Quantity
            }).ToList();

            var options = new SessionCreateOptions
            {
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = "http://localhost:3000/successfulpayment",
                CancelUrl = "http://localhost:3000/shoppingcart"
            };

            try
            {
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
