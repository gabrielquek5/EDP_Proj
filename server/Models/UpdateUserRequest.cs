using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
	public class UpdateUserRequest
	{
		[MaxLength(30)]
		public string FirstName { get; set; } = string.Empty;


		[MaxLength(30)]
		public string LastName { get; set; } = string.Empty;



		[MaxLength(8)]
		public string PhoneNumber { get; set; } = string.Empty;

		[MaxLength(100)]
		public string Password { get; set; } = string.Empty;
	}
}
