using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using System.Collections.Generic;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController: Controller
    {
        private readonly MyDbContext _context;
        public NotificationController(MyDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<Notification> result = _context.Notifications;
                if (search != null)
                {
                    result = result.Where(x => x.Name.Contains(search) || x.Description.Contains(search));
                }
                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, $"Internal Server Error from GET ALL:  {ex.Message}");
            }

        }
        [HttpPost]
        public IActionResult AddNotification(Notification notification)
        {
            try
            {
                var now = DateTime.Now;
                var adminNotification = new Notification()
                {
                    Name = notification.Name,
                    Description = notification.Description.Trim(),
                    EndDate = notification.EndDate,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                _context.Notifications.Add(adminNotification);
                _context.SaveChanges();
                return Ok(adminNotification);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "Internal Server Error from POST");
            }

        }

        [HttpGet("{id}")]
        public IActionResult GetNotification(int id)
        {
            try
            {
                Notification? notification = _context.Notifications.Find(id);
                if (notification == null)
                {
                    return NotFound();
                }
                return Ok(notification);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "Internal Server Error from GET ID");
            }

        }

        [HttpPut("{id}")]
        public IActionResult UpdateNotification(int id, Notification notification)
        {
            try
            {
                var adminNotification = _context.Notifications.Find(id);

                if (adminNotification == null)
                {
                    return NotFound();
                }
                adminNotification.Name = notification.Name.Trim();
                adminNotification.Description = notification.Description.Trim();

                adminNotification.EndDate = notification.EndDate;
                adminNotification.UpdatedAt = DateTime.Now;
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "Internal Server Error FOR PUT ID");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNotification(int id)
        {
            try
            {
                var adminNotification = _context.Notifications.Find(id);
                if (adminNotification == null)
                {
                    return NotFound();
                }
                _context.Notifications.Remove(adminNotification);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "Internal Server Error for delete");
            }

        }
    }
}
