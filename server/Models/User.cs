using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
	public class User
	{
		public int Id { get; set; }


		[MaxLength(30)]
		public string FirstName { get; set; } = string.Empty;


		[MaxLength(30)]
		public string LastName { get; set; } = string.Empty;

		[MaxLength(50)]
		public string Email { get; set; } = string.Empty;
		
		[MaxLength(8)]
		public string PhoneNumber { get; set; } = string.Empty;

		[MaxLength(100)]
		public string Password { get; set; } = string.Empty;
		[Column(TypeName ="datetime")]
		public DateTime CreatedAt { get; set; }
		[Column(TypeName ="datetime")]
		public DateTime UpdatedAt { get; set; }

	}
}
