using WebApplication1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using WebApplication1;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminReviewsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public AdminReviewsController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("reported")]
        public IActionResult GetReportedReviews(string? search)
        {
            try
            {
                

                var result = _context.Reviews
                    .Include(s => s.Schedule)
                    .Where(r => r.Reported)
                    .Select(review => new
                    {
                        review.ReviewID,
                        review.Rating,
                        review.Comments,
                        review.Picture,
                        review.Reported,
                        EventTitle = review.Schedule.Title,
                        ScheduleId = review.Schedule.ScheduleId,
                        
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

        [HttpPut("{id}")]
        public IActionResult UnreportReview(int id)
        {
            try
            {
                var review = _context.Reviews.Find(id);
                if (review == null)
                {
                    return NotFound();
                }

                if (!review.Reported)
                {
                    return BadRequest("Review is not reported.");
                }

                review.Reported = false;
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
            try
            {
                var review = _context.Reviews.Find(id);
                if (review == null)
                {
                    return NotFound();
                }

                _context.Reviews.Remove(review);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }


    }
}
