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
                IQueryable<Review> result = _context.Reviews.Where(r => r.Reported);

                if (!string.IsNullOrEmpty(search))
                {
                    result = result.Where(r => r.Comments.Contains(search) || r.Rating.ToString().Contains(search));
                }

                var reportedReviews = result.OrderByDescending(r => r.createdAt).ToList();
                return Ok(reportedReviews);
            }
            catch (Exception ex)
            {
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
