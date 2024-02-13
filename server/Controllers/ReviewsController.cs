using WebApplication1.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ReviewsController(MyDbContext context)
        {
            _context = context;
        }

        private static readonly List<Review> list = new();

        /*        [HttpGet]
                public IActionResult GetAll(string? search)
                {
                    try
                    {
                        IQueryable<Review> result = _context.Reviews;

                        if (search != null)
                        {
                            result = result.Where(x => x.Comments.Contains(search)
                                || x.Rating.ToString().Contains(search));
                        }

                        var list = result.ToList().OrderByDescending(x => x.createdAt).ToList();
                        return Ok(list);
                    }
                    catch (Exception ex)
                    {
                        // Log or handle the exception as needed
                        return StatusCode(500, "An error occurred while processing the request.");
                    }
                }*/

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            try
            {
                int userId = GetUserId();

                var result = _context.Reviews
                    .Include(s => s.Schedule)
                    .Where(s => s.Schedule.IsDeleted == false)
                    .Select(review => new
                    {
                        review.ReviewID,
                        review.Rating,
                        review.Comments,
                        review.Picture,
                        EventTitle = review.Schedule.Title,
                        ScheduleId = review.Schedule.ScheduleId,
                        userId = userId,
                        username = review.User.FirstName,
                        // Include other properties you need
                    });

                // Apply search filter if search parameter is provided
                if (!string.IsNullOrEmpty(search))
                {
                    result = result.Where(x => x.Comments.Contains(search)
                                            || x.Rating.ToString().Contains(search));
                }

                // Execute the query and convert the result to a list
                var resultList = result.ToList();

                return Ok(resultList);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpGet("{id}")]
        public IActionResult GetReview(int id)
        {
            Review? review = _context.Reviews.Find(id);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        [HttpGet("{id}/schedules")]
        public IActionResult GetReviewsForSchedule(int id)
        {
            // Retrieve reviews with matching ScheduleId
            var reviewsForSchedule = _context.Reviews
                .Where(r => r.ScheduleId == id)
                .Select(review => new
                {
                    review.ReviewID,
                    review.Rating,
                    review.Comments,
                    review.Picture,
                    EventTitle = review.Schedule.Title,
                    ScheduleId = review.Schedule.ScheduleId,
                    userId = GetUserId(),
                    firstname = review.User.FirstName,
                    lastname = review.User.LastName,
                    // Include other properties you need
                });

            if (!reviewsForSchedule.Any())
            {
                return NotFound("No reviews found for this event.");
            }

            return Ok(reviewsForSchedule);
        }


        [HttpPost("{id}")]
        public IActionResult AddReview(int id, Review review)
        {
            try
            {
                var now = DateTime.Now;

                // Check if the booking exists
                var booking = _context.Bookings.FirstOrDefault(b => b.BookingID == id);
                if (booking == null)
                {
                    return NotFound("Booking not found");
                }

                var myReview = new Review()
                {
                    Rating = review.Rating,
                    Comments = review.Comments,
                    Picture = review.Picture,
                    createdAt = now,
                    updatedAt = now,
                    Reported = false,
                    UserId = GetUserId(),
                    BookingId = id,
                    ScheduleId= booking.ScheduleId
                };

                _context.Reviews.Add(myReview);
                _context.SaveChanges();

                return Ok(myReview);
            }
            catch (Exception ex)
            {
                // Log the exception or return a meaningful error message
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }




        [HttpPut("{id}")]
        public IActionResult UpdateReview(int id, Review review)
        {
            var myReview = _context.Reviews.Find(id);
            if (myReview == null)
            {
                return NotFound();
            }
            myReview.Rating = review.Rating;
            myReview.Comments = review.Comments.Trim();
            myReview.Picture = review.Picture;
            myReview.updatedAt=DateTime.Now;
            myReview.Reported=review.Reported;

            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}/report-review")]
        public IActionResult ReportReview(int id)
        {
            try
            {
                var review = _context.Reviews.Find(id);
                if (review == null)
                {
                    return NotFound();
                }

                review.Reported = true;
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteReview(int id)
        {
            var myReview = _context.Reviews.Find(id);
            if (myReview == null)
            {
                return NotFound();
            }
            _context.Reviews.Remove(myReview);
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
