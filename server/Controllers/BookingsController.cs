
﻿using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1;
using Stripe;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly MyDbContext _context;
        public BookingsController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<Booking> result = _context.Bookings;
                if (search != null)
                {
                    result = result.Where(x => x.BookingDate.ToString().Contains(search)
                    || x.BookingID.ToString().Contains(search));
                }
                var list = result.ToList().OrderByDescending(x => x.createdAt).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpGet("{id}")]
        public IActionResult GetBooking(int id)
        {
            Booking? booking = _context.Bookings.Find(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpPost("{id}")]
        public IActionResult AddBooking(int id,Booking booking)
        {
            var now = DateTime.Now;
            var myBooking = new Booking()
            {
                BookingDate = booking.BookingDate,
                Pax = booking.Pax,
                Price = booking.Price,
                BookingTitle = booking.BookingTitle,
                createdAt = now,
                updatedAt = now,
                ScheduleId=id,
                UserId=1,
            };
            _context.Bookings.Add(myBooking);
            _context.SaveChanges();
            return Ok(myBooking);
        }

        [HttpPut("{id}")]
        public IActionResult SoftDeleteBooking(int id)
        {
            var myBooking = _context.Bookings.Find(id);
            if (myBooking == null)
            {
                return NotFound();
            }

            int userId = GetUserId();
            if (myBooking.UserId != userId)
            {
                return Forbid();
            }

            myBooking.IsCancelled = true;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBooking(int id)
        {
            var myBooking = _context.Bookings.Find(id);
            if (myBooking == null)
            {
                return NotFound();
            }
            _context.Bookings.Remove(myBooking);
            _context.SaveChanges();
            return Ok();
        }

        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }

    }
}
