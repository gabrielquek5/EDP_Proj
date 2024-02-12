
﻿using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

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
                int userId = GetUserId();

                var result = _context.Bookings
                    .Include(s => s.Schedule)
                    
              
                    .Select(booking => new
                    {
                        booking.BookingID,
                        booking.BookingDate,
                        booking.BookingTime,
                        booking.Pax,
                        booking.BookingTitle,
                        booking.IsCancelled,
                        EventType = booking.Schedule.EventType,
                        IsCompleted = booking.Schedule.IsCompleted,
                        HasReview = booking.HasReview,
                        ScheduleId = booking.Schedule.ScheduleId,
                        userId = userId
                        // Include other properties you need
                    })
                    .ToList();

                
               
                return Ok(result);
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
            int userId = GetUserId();
            var result = _context.Bookings
            .Include(booking => booking.Schedule) // Include the Schedule related data
            .Where(booking => booking.BookingID == id) // Filter by booking ID
            .Select(booking => new
            {
                booking.BookingID,
                booking.BookingDate,
                booking.BookingTime,
                booking.Pax,
                booking.BookingTitle,
                booking.IsCancelled,
                EventTitle = booking.Schedule.Title,
                ImageFile = booking.Schedule.ImageFile,
                EventDesription = booking.Schedule.Description,
                EventType = booking.Schedule.EventType,
                IsCompleted = booking.Schedule.IsCompleted,
                HasReview = booking.HasReview,
                ScheduleId = booking.Schedule.ScheduleId,
                userId = userId
                // Include other properties you need
            })
            .ToList();
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost("{id}")]
        public IActionResult AddBooking(int id,Booking booking)
        {
            var now = DateTime.Now;
            var myBooking = new Booking()
            {
                BookingDate = booking.BookingDate,
                BookingTime = booking.BookingTime,
                Pax = booking.Pax,
                Price = booking.Price,
                BookingTitle = booking.BookingTitle,
                createdAt = now,
                updatedAt = now,
                ScheduleId=id,
                UserId=GetUserId(), //might cause problems, havent tested
            };
            _context.Bookings.Add(myBooking);
            _context.SaveChanges();
            return Ok(myBooking);
        }

        [HttpPut("{id}/cancel-booking")]
        public IActionResult CancelBooking(int id)
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

        [HttpPut("{id}/complete-booking")]
        public IActionResult CompleteBooking(int id)
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

            myBooking.IsCompleted = true;
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}/has-review")]
        public IActionResult HasReview(int id)
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

            myBooking.HasReview = true;
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}/remove-review")]
        public IActionResult RemoveReview(int id)
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

            myBooking.HasReview = false;
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
