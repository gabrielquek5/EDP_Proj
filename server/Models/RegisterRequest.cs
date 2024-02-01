using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
	public class RegisterRequest
	{
		[Required(ErrorMessage = "Please enter First Name.")]
		[StringLength(30, MinimumLength = 2, ErrorMessage = "Your first name must have at least 2 to 30 characters.")]
		[RegularExpression(@"^[\p{L}' \-,.]+$", ErrorMessage = "Only letters, spaces, and characters: ' - , . are allowed in the first name.")]
		public string FirstName { get; set; } = string.Empty;



		[Required(ErrorMessage = "Please enter Last Name.")]
		[StringLength(30, MinimumLength = 2, ErrorMessage = "Your last name must have at least 2 to 30 characters.")]
		[RegularExpression(@"^[\p{L}' \-,.]+$", ErrorMessage = "Only letters, spaces, and characters: ' - , . are allowed in the first name.")]
		public string LastName { get; set; } = string.Empty;

		[Required(ErrorMessage = "Please enter your Email Address.")]
		[EmailAddress(ErrorMessage = "You've entered an invalid email address.")]
		[StringLength(50, ErrorMessage = "Your email address should not be more than 50 characters.")]
		public string Email { get; set; } = string.Empty;


		[Required(ErrorMessage = "Please enter your Mobile Number.")]
		[StringLength(8, MinimumLength = 8, ErrorMessage = "You've entered an invalid Mobile Number.")]
		[RegularExpression(@"^[89]\d{7}$", ErrorMessage = "Your Mobile Number should only be numbers.")]
		public string PhoneNumber { get; set; } = string.Empty;



		[Required, MinLength(8), MaxLength(50)]
		[RegularExpression(@"^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$",
		ErrorMessage = "At least 1 letter and 1 number")]
		public string Password { get; set; } = string.Empty;

	}
}
