using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using Stripe;

namespace WebApplication1.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class RewardController : ControllerBase
	{
		private readonly MyDbContext _context;

		public RewardController(MyDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult GetAll(string? search)
		{
			IQueryable<Reward> result = _context.Rewards.Include(t => t.User);
			if (search != null)
			{
				result = result.Where(x => x.Title.Contains(search)
					|| x.Description.Contains(search));
			}
			var list = result.ToList().OrderByDescending(x => x.CreatedAt).ToList();
			var data = list.Select(t => new
			{
				t.Id,
				t.Title,
				t.Description,
				t.Duration,  // Include Duration in the response
				t.ImageFile,
				t.Code,
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
		public IActionResult GetReward(int id)
		{
			Reward? reward = _context.Rewards.Include(t => t.User)
				.FirstOrDefault(t => t.Id == id);
			if (reward == null)
			{
				return NotFound();
			}
			var data = new
			{
				reward.Id,
				reward.Title,
				reward.Description,
				reward.Duration,  // Include Duration in the response
				reward.ImageFile,
				reward.CreatedAt,
				reward.Code,
				reward.UpdatedAt,
				reward.UserId,
				User = new
				{
					reward.User?.FirstName
				}
			};
			return Ok(data);
		}

		[HttpPost, Authorize]
		public IActionResult AddReward(Reward reward)
		{
			StripeConfiguration.ApiKey = "sk_test_51OPMIjE7dlDzSq3bdLinND1GsOB1umKYNwDgYOubmE9LyTupQQHt0cFKj5re4ucAl3E5PINgwPS74OJgWyxvaE3U00AYisjkJZ";

			// Create a coupon
			var couponOptions = new CouponCreateOptions
			{
				PercentOff = 10, // You can adjust this percentage as needed
				Duration = "once", // Duration of the coupon
								   // Add other coupon options as needed
			};
			var couponService = new CouponService();
			var coupon = couponService.Create(couponOptions);
			var Code = GenerateRedemptionCode();
			// Create a promotion code
			var codeOptions = new PromotionCodeCreateOptions
			{
				Coupon = coupon.Id, // Use the ID of the created coupon
				Code = Code // Generate a redemption code
			};
			var codeService = new PromotionCodeService();
			var code = codeService.Create(codeOptions);

			int userId = GetUserId();
			var now = DateTime.Now;
			var myReward = new Reward()
			{
				Title = reward.Title.Trim(),
				Description = reward.Description.Trim(),
				Duration = reward.Duration.Trim(),  // Include Duration in the creation
				ImageFile = reward.ImageFile,
				CreatedAt = now,
				UpdatedAt = now,
				UserId = userId,
				CouponId = coupon.Id,   // Store the coupon ID
				Code = Code, // Store the code ID
			};

			_context.Rewards.Add(myReward);
			_context.SaveChanges();
			return Ok(myReward);
		}

		[HttpPut("{id}"), Authorize]
		public IActionResult UpdateReward(int id, Reward reward)
		{
			var myReward = _context.Rewards.Find(id);
			if (myReward == null)
			{
				return NotFound();
			}

			int userId = GetUserId();
			if (myReward.UserId != userId)
			{
				return Forbid();
			}

			myReward.Title = reward.Title.Trim();
			myReward.Description = reward.Description.Trim();
			myReward.Duration = reward.Duration.Trim();  // Update Duration
			myReward.ImageFile = reward.ImageFile;
			myReward.UpdatedAt = DateTime.Now;
			myReward.UserId = userId;

			_context.SaveChanges();
			return Ok();
		}

		[HttpDelete("{id}"), Authorize]
		public IActionResult DeleteReward(int id)
		{
			var myReward = _context.Rewards.Find(id);
			if (myReward == null)
			{
				return NotFound();
			}

			int userId = GetUserId();
			if (myReward.UserId != userId)
			{
				return Forbid();
			}

			_context.Rewards.Remove(myReward);
			_context.SaveChanges();
			return Ok();
		}

		private string GenerateRedemptionCode()
		{
			const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var random = new Random();
			var redemptionCode = new string(Enumerable.Repeat(chars, 6)
			  .Select(s => s[random.Next(s.Length)]).ToArray());

			return redemptionCode;
		}

		private int GetUserId()
		{
			return Convert.ToInt32(User.Claims
				.Where(c => c.Type == ClaimTypes.NameIdentifier)
				.Select(c => c.Value).SingleOrDefault());
		}
	}
}
