using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Stripe;


namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ScheduleController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<Schedule> result = _context.Schedules.Include(t => t.User);
                if (search != null)
                {
                    result = result.Where(x => x.Title.Contains(search) || x.Description.Contains(search) || x.PostalCode.Contains(search));
                }
                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                var data = list.Select(t => new
                {
                    t.ScheduleId,
                    t.Title,
                    t.Description,
                    t.PostalCode,
                    t.SelectedDate,
                    t.SelectedTime,
                    t.ImageFile,
                    t.Price,
                    t.EventType,
                    t.IsDeleted,
                    t.CreatedAt,
                    t.UpdatedAt,
                    t.UserId,
                    User = new
                    {
                        t.User?.FirstName
                    }
                });
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpGet("{id}")]
        public IActionResult GetSchedule(int id)
        {
            Schedule? schedule = _context.Schedules.Include(t => t.User)
                .FirstOrDefault(t => t.ScheduleId == id);
            if (schedule == null)
            {
                return NotFound();
            }
            var data = new
            {
                schedule.ScheduleId,
                schedule.Title,
                schedule.Description,
                schedule.PostalCode,
                schedule.SelectedDate,
                schedule.SelectedTime,
                schedule.ImageFile,
                schedule.Price,
                schedule.EventType,
                schedule.IsDeleted,
                schedule.CreatedAt,
                schedule.UpdatedAt,
                schedule.UserId,
                User = new
                {
                    schedule.User?.FirstName
                }
            };
            return Ok(data);
        }

        [HttpPost, Authorize]
        public IActionResult AddSchedule(Schedule schedule)
        {

            StripeConfiguration.ApiKey = "sk_test_51OPMIjE7dlDzSq3bdLinND1GsOB1umKYNwDgYOubmE9LyTupQQHt0cFKj5re4ucAl3E5PINgwPS74OJgWyxvaE3U00AYisjkJZ";

            // Create a Product
            var productOptions = new ProductCreateOptions
            {
                Name = schedule.Title,
                Description = schedule.Description,
                Images = new List<string> { schedule.ImageFile }
            };

            var productService = new ProductService();
            var product = productService.Create(productOptions);

            // Create a Price
            var priceOptions = new PriceCreateOptions
            {
                UnitAmountDecimal = (long)(schedule.Price * 100), // Convert the price to cents if not already in cents
                Currency = "sgd", // Set the currency code (adjust if needed)
                Product = product.Id, // Associate the Price with the Product
                Metadata = new Dictionary<string, string>
                {
                    { "schedule_id", schedule.ScheduleId.ToString() } // Optionally add metadata
                }
            };

            var priceService = new PriceService();
            var price = priceService.Create(priceOptions);

            //create in db
            int userId = GetUserId();
            var now = DateTime.Now;
            var mySchedule = new Schedule()
            {
                Title = schedule.Title.Trim(),
                Description = schedule.Description.Trim(),
                PostalCode = schedule.PostalCode.Trim(),
                SelectedDate = schedule.SelectedDate,
                SelectedTime = schedule.SelectedTime,
                ImageFile = schedule.ImageFile,
                Price = schedule.Price,
                EventType = schedule.EventType,
                IsDeleted = false,
                CreatedAt = now,
                UpdatedAt = now,
                UserId = userId
            };

            _context.Schedules.Add(mySchedule);
            _context.SaveChanges();
            return Ok(mySchedule);
        }

        [HttpPut("{id}"), Authorize]
        public IActionResult UpdateSchedule(int id, Schedule schedule)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUserId();
            if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

            mySchedule.Title = schedule.Title.Trim();
            mySchedule.Description = schedule.Description.Trim();
            mySchedule.PostalCode = schedule.PostalCode.Trim();
            mySchedule.SelectedDate = schedule.SelectedDate;
            mySchedule.SelectedTime = schedule.SelectedTime;
            mySchedule.ImageFile = schedule.ImageFile;
            mySchedule.Price = schedule.Price;
            mySchedule.EventType = schedule.EventType.Trim();
            mySchedule.IsDeleted = false;
            mySchedule.UpdatedAt = DateTime.Now;

            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}"), Authorize]
        public IActionResult DeleteSchedule(int id, Schedule schedule)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUserId();
            if (mySchedule.UserId != userId)
            {
                return Forbid();
            }


            _context.Schedules.Remove(mySchedule);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}/soft-delete"), Authorize]
        public IActionResult SoftDeleteSchedule(int id)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUserId();
            if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

            mySchedule.IsDeleted = true;
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
