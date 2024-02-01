using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication1.Migrations;

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
            IQueryable<Schedule> result = _context.Schedules.Include(t => t.User);
            if (search != null)
            {
                result = result.Where(x => x.Title.Contains(search)
                    || x.Description.Contains(search));
            }
            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            var data = list.Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.ImageFile,
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

        [HttpGet("{id}")]
        public IActionResult GetSchedule(int id)
        {
            Schedule? schedule = _context.Schedules.Include(t => t.User)
                .FirstOrDefault(t => t.Id == id);
            if (schedule == null)
            {
                return NotFound();
            }
            var data = new
            {
                schedule.Id,
                schedule.Title,
                schedule.Description,
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
            int userId = GetUserId();
            var now = DateTime.Now;
            var mySchedule = new Schedule()
            {
                Title = schedule.Title.Trim(),
                Description = schedule.Description.Trim(),
                ImageFile = schedule.ImageFile,
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
            mySchedule.ImageFile = schedule.ImageFile;
            mySchedule.UpdatedAt = DateTime.Now;

            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}"), Authorize]
        public IActionResult DeleteSchedule(int id)
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

        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }
    }
}
