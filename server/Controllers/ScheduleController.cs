using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Stripe;
using WebApplication1.EmailStuff;
using System.Text;


namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly EMAIL_Consts _emailConsts;
        private readonly EmailService _emailService;

        public ScheduleController(MyDbContext context)
        {
            _context = context;
            _emailConsts = new EMAIL_Consts();
            _emailService = new EmailService(_emailConsts.EMAIL_API());
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<Schedule> result = _context.Schedules.Include(t => t.User);
                if (!string.IsNullOrEmpty(search))
                {
                    result = result.Where(x =>
                        (x.Title.Contains(search) ||
                         x.Description.Contains(search) ||
                         x.PostalCode.Contains(search) ||
                         x.EventType.Contains(search)) &&
                        !x.IsCompleted
                    );
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
                    t.RequestDelete,
                    t.IsDeleted,
                    t.IsCompleted,
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

		[HttpGet("/adminschedule")]
		public IActionResult GetAllAdmin(string? search)
		{
			try
			{
				IQueryable<Schedule> result = _context.Schedules.Include(t => t.User);
				if (!string.IsNullOrEmpty(search))
				{
					result = result.Where(x =>
						(x.Title.Contains(search) ||
						 x.Description.Contains(search) ||
						 x.PostalCode.Contains(search) ||
						 x.EventType.Contains(search))
					);
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
					t.RequestDelete,
					t.IsDeleted,
					t.IsCompleted,
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
                schedule.RequestDelete,
                schedule.IsDeleted,
                schedule.IsCompleted,
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
        public async Task<IActionResult> AddSchedule(Schedule schedule)
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
                UnitAmountDecimal = (long)(schedule.Price * 100),
                Currency = "sgd",
                Product = product.Id,
                Metadata = new Dictionary<string, string>
                {
                    { "schedule_id", schedule.ScheduleId.ToString() }
                }
            };

            var priceService = new PriceService();
            var price = priceService.Create(priceOptions);

            //create in db
            int userId = GetUser().ID();

            string userEmail = GetUser().Email();
            string userName = GetUser().UserName();

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
                RequestDelete = false,
                IsDeleted = false,
                IsCompleted = false,
                CreatedAt = now,
                UpdatedAt = now,
                UserId = userId,
                PriceID = price.Id,
                StripeID = product.Id,
            };

            _context.Schedules.Add(mySchedule);
            _context.SaveChanges();

            //await _emailService.SendEventAddedEmail(userEmail, userName, mySchedule.Title);

            return Ok(mySchedule);
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateSchedule(int id, Schedule schedule)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUser().ID();

            if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

			string userEmail = GetUser().Email();
			string userName = GetUser().UserName();

			// Creating strings to store before and after values
			var changes = new StringBuilder();
            var beforeValues = new StringBuilder();
            var afterValues = new StringBuilder();

            void AppendChange(string propertyName, string before, string after)
            {
                beforeValues.AppendLine($"{propertyName}: {before}");
                afterValues.AppendLine($"{propertyName}: {after}");
                changes.AppendLine($"- {propertyName}: {before} => {after}");
            }

            if (mySchedule.Title != schedule.Title)
            {
                AppendChange("Title", mySchedule.Title, schedule.Title.Trim());
                mySchedule.Title = schedule.Title.Trim();
            }

            if (mySchedule.Description != schedule.Description)
            {
                AppendChange("Description", mySchedule.Description, schedule.Description.Trim());
                mySchedule.Description = schedule.Description.Trim();
            }

            if (mySchedule.EventType != schedule.EventType)
            {
                AppendChange("EventType", mySchedule.EventType, schedule.EventType.Trim());
                mySchedule.EventType = schedule.EventType.Trim();
            }

            if (mySchedule.PostalCode != schedule.PostalCode)
            {
                AppendChange("PostalCode", mySchedule.PostalCode, schedule.PostalCode.Trim());
                mySchedule.PostalCode = schedule.PostalCode.Trim();
            }

            if (mySchedule.SelectedDate != schedule.SelectedDate)
            {
                AppendChange("ScheduleDate", mySchedule.SelectedDate.ToString(), schedule.SelectedDate.ToString());
                mySchedule.SelectedDate = schedule.SelectedDate;
            }

            if (mySchedule.SelectedTime != schedule.SelectedTime)
            {
                AppendChange("SelectedTime", mySchedule.SelectedTime.ToString(), schedule.SelectedTime.ToString());
                mySchedule.SelectedTime = schedule.SelectedTime;
            }
            
            //mySchedule.SelectedDate = schedule.SelectedDate;
            //mySchedule.SelectedTime = schedule.SelectedTime;
            mySchedule.ImageFile = schedule.ImageFile;
            mySchedule.Price = schedule.Price;
            mySchedule.RequestDelete = false;
            mySchedule.IsDeleted = false;
            mySchedule.IsCompleted = false;
            mySchedule.UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            /*if (changes.Length > 0)
            {
                await _emailService.SendScheduleUpdateEmail(userEmail, userName, mySchedule.Title,  changes.ToString(), beforeValues.ToString(), afterValues.ToString());
            }*/

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

            int userId = GetUser().ID();
            if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

            _context.Schedules.Remove(mySchedule);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("{id}/request-delete"), Authorize]
        public async Task<IActionResult> RquestSoftDeleteSchedule(int id)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUser().ID();
            if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

			string userEmail = GetUser().Email();
			string userName = GetUser().UserName();

			mySchedule.RequestDelete = true;
            _context.SaveChanges();

            //await _emailService.SendEventRequestDeleteEmail(userEmail, userName, mySchedule.Title);

            return Ok();
        }

		[HttpPut("{id}/reject-soft-delete"), Authorize]
		public async Task<IActionResult> RejectDeleteSchedule(int id)
		{
			var mySchedule = _context.Schedules.Find(id);
			if (mySchedule == null)
			{
				return NotFound();
			}

			int userId = GetUser().ID();
			string userEmail = GetUser().Email();
			string userName = GetUser().UserName();
			if (mySchedule.UserId != userId)
			{
				return Forbid();
			}

			mySchedule.IsDeleted = false;
            mySchedule.RequestDelete = false;
			mySchedule.UpdatedAt = DateTime.Now;
			_context.SaveChanges();

			//await _emailService.SendEventDeleteRejectedEmail(userEmail, userName, mySchedule.Title);

			return Ok();
		}

		[HttpPut("{id}/soft-delete"), Authorize]
        public async Task<IActionResult> SoftDeleteSchedule(int id)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUser().ID();
			string userEmail = GetUser().Email();
			string userName = GetUser().UserName();
			if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

            mySchedule.IsDeleted = true;
            mySchedule.UpdatedAt = DateTime.Now;
            _context.SaveChanges();

            //await _emailService.SendEventDeleteApprovedEmail(userEmail, userName, mySchedule.Title);

            return Ok();
        }

        [HttpPut("{id}/end-event"), Authorize]
        public async Task<IActionResult> EndEvent(int id)
        {
            var mySchedule = _context.Schedules.Find(id);
            if (mySchedule == null)
            {
                return NotFound();
            }

            int userId = GetUser().ID();
			string userEmail = GetUser().Email();
			string userName = GetUser().UserName();
			if (mySchedule.UserId != userId)
            {
                return Forbid();
            }

            mySchedule.IsCompleted = true;
            mySchedule.UpdatedAt = DateTime.Now;
            _context.SaveChanges();

            //await _emailService.SendEventEndedEmail(userEmail, userName, mySchedule.Title);

            return Ok();
        }

        private class UserCreds
        {
            public int UserId { get; set; }
            public string UserEmail { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }

            public UserCreds(int userId, string userEmail, string firstName, string lastName)
            {
                UserId = userId;
                UserEmail = userEmail;
                FirstName = firstName;
                LastName = lastName;
            }

            public int ID()
            {
                return UserId;
            }

            public string Email()
            {
                return UserEmail;
            }
            public string UserName()
            {
                return $"{FirstName} {LastName}";
            }
        }

        private UserCreds GetUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);

            if (userIdClaim != null && emailClaim != null)
            {
                int userId = Convert.ToInt32(userIdClaim.Value);
                string email = emailClaim.Value;
                var user = _context.Users.FirstOrDefault(u => u.Email == email);

                if (user != null)
                {
                    string firstName = user.FirstName;
                    string lastName = user.LastName;
                    return new UserCreds(userId, email, firstName, lastName);
                }
            }
            return new UserCreds(-1, null, null, null);
        }
    }
}
