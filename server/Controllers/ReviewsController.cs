using WebApplication1.Models;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
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

        [HttpPost]
        public IActionResult AddReview(Review review)
        {
            var now = DateTime.Now;
            var myReview = new Review()
            {
                Rating = review.Rating,
                Comments = review.Comments,
                Picture = review.Picture,
                createdAt = now,
                updatedAt = now,
                ScheduleId = review.ScheduleId,
                UserId= review.UserId,
                Reported = false
            };

            _context.Reviews.Add(myReview);
            _context.SaveChanges();

            return Ok(myReview);
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
    }
}
