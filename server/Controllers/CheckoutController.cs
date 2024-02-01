/*using EDP_Project.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Stripe;
using Stripe.Checkout;
using EDP_Project;

public class StripeOptions
{
    public string option { get; set; }
}


namespace server.Controllers
{
    [Route("create-checkout-session")]
    [ApiController]
    public class CheckoutApiController : Controller
    {
        private readonly MyDbContext _context;

        public CheckoutApiController(MyDbContext context)
        {
            _context = context;
        }
            
        [HttpPost]
        public IActionResult Create()
        {
            var domain = "http://localhost:7104"; 

            // Retrieve cart items from the database
            List<ShoppingCart> cartItems = _context.ShoppingCarts.ToList();

            // Build line items for the session
            var lineItems = cartItems.Select(item => new SessionLineItemOptions
            {
                Price = "price_1OcPNeE7dlDzSq3bKBF6m7cH", // Price ID for the product
                Quantity = item.Quantity
            }).ToList();

            var options = new SessionCreateOptions
            {
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = domain + "?success=true",
                CancelUrl = domain + "?canceled=true"
            };

            try
            {
                var service = new SessionService();
                Session session = service.Create(options);

                // Redirect the user to the Stripe hosted checkout page
                Response.Headers.Add("Location", session.Url);
                return new StatusCodeResult(303);
            }
            catch (Exception ex)
            {
                // Handle errors
                return BadRequest("Failed to create checkout session: " + ex.Message);
            }
        }
    }
}*/