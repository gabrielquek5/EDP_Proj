using WebApplication1.Controllers;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace WebApplication1.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class UserController : ControllerBase
	{

		private readonly MyDbContext _context;
		private readonly IConfiguration _configuration;
		public UserController(MyDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}
		[HttpGet("auth"), Authorize]
		public IActionResult Auth()
		{
			var id = Convert.ToInt32(User.Claims.Where(
			c => c.Type == ClaimTypes.NameIdentifier)
			.Select(c => c.Value).SingleOrDefault());
			var name = User.Claims.Where(c => c.Type == ClaimTypes.Name)
			.Select(c => c.Value).SingleOrDefault();
			var email = User.Claims.Where(c => c.Type == ClaimTypes.Email)
			.Select(c => c.Value).SingleOrDefault();
			if (id != 0 && name != null && email != null)
			{
				var user = new
				{
					id,
					email,
					name,
				};
				return Ok(new { user });
			}
			else
			{
				return Unauthorized();
			}
		}

		[HttpPost("login")]
		public IActionResult Login(LoginRequest request)
		{
			//Trim string values
			request.Email = request.Email.Trim().ToLower();
			request.Password = request.Password.Trim();

			//Check email and password
			string message = "Email or password is incorrect.";
			var foundUser = _context.Users.Where(x => x.Email == request.Email).FirstOrDefault();

			if (foundUser == null)
			{
				return BadRequest(new { message });
			}

			bool verified = BCrypt.Net.BCrypt.Verify(request.Password, foundUser.Password);
			if (!verified) 
			{
				return BadRequest(new { message });
			}

			// Return user info
			var user = new
			{
				foundUser.Id,
				foundUser.Email,
				foundUser.FirstName,
				foundUser.LastName,
				foundUser.PhoneNumber

			};
			string accessToken = CreateToken(foundUser);
			return Ok(new { user, accessToken });
		}


		[HttpPost("register")]
		public IActionResult Register(RegisterRequest request)
		{
			request.FirstName = request.FirstName.Trim();
			request.LastName = request.LastName.Trim();
			request.Email = request.Email.Trim();
			request.PhoneNumber = request.PhoneNumber.Trim();
			request.Password = request.Password.Trim();
			// Check email
			var foundUser = _context.Users.Where(
				x => x.Email == request.Email ).FirstOrDefault();
			if (foundUser != null)
			{
				string message = "Email already exists.";
				return BadRequest(new { message });
			}

			//create user object
			var now = DateTime.Now;
			string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
			var user = new User()
			{
				FirstName = request.FirstName,
				LastName = request.LastName,
				PhoneNumber = request.PhoneNumber,
				Email = request.Email,
				Password = passwordHash,
				CreatedAt = now,
				UpdatedAt = now
			};

			//add user
			_context.Users.Add(user);
			_context.SaveChanges();
			return Ok();
		}
		private string CreateToken(User user)
		{
			string secret = _configuration.GetValue<string>("Authentication:Secret");
			int tokenExpiresDays = _configuration.GetValue<int>("Authentication:TokenExpiresDays");

			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes(secret);

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
			new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
			new Claim(ClaimTypes.Name, user.FirstName),
			new Claim(ClaimTypes.Email, user.Email),

				}),
				Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
				SigningCredentials = new SigningCredentials(
					new SymmetricSecurityKey(key),
					SecurityAlgorithms.HmacSha256Signature
				)
			};

			var securityToken = tokenHandler.CreateToken(tokenDescriptor);
			string token = tokenHandler.WriteToken(securityToken);
			return token;
		}
		[HttpPut("update"), Authorize]
		public IActionResult UpdateUser(UpdateUserRequest request)
		{
			var userId = Convert.ToInt32(User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier)
								.Select(c => c.Value).SingleOrDefault());

			var user = _context.Users.Find(userId);

			if (user == null)
			{
				return NotFound();
			}

			// Update user properties
			if (!string.IsNullOrWhiteSpace(request.FirstName))
			{
				user.FirstName = request.FirstName.Trim();
			}

			if (!string.IsNullOrWhiteSpace(request.LastName))
			{
				user.LastName = request.LastName.Trim();
			}

			if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
			{
				user.PhoneNumber = request.PhoneNumber.Trim();
			}

			if (!string.IsNullOrWhiteSpace(request.Password))
			{
				user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password.Trim());
			}

			// Update the user in the database
			_context.Users.Update(user);
			_context.SaveChanges();

			return Ok();
		}

		[HttpDelete("delete"), Authorize]
		public IActionResult DeleteUser()
		{
			var userId = Convert.ToInt32(User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier)
								.Select(c => c.Value).SingleOrDefault());

			var user = _context.Users.Find(userId);

			if (user == null)
			{
				return NotFound();
			}

			// Delete the user from the database
			_context.Users.Remove(user);
			_context.SaveChanges();

			return Ok("User deleted successfully.");
		}



	}
}
