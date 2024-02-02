using WebApplication1.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
	public class User
	{
		[Key]
		public int UserId { get; set; }


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

        // Navigation property to represent the one-to-many relationship

		[JsonIgnore]
		public List<ShoppingCart>? ShoppingCarts { get; set;}
        [JsonIgnore]
        public List<Booking>? Bookings { get; set; }
        [JsonIgnore]
        public List<Review>? Reviews { get; set; }
        [JsonIgnore]
        public List<Schedule>? Schedules { get; set; }
        [JsonIgnore]
        public List<Notification>? Notifications { get; set; }
        [JsonIgnore]
    		public List<Reward>? Rewards { get; set; }
		    [JsonIgnore]
		    public List<Schedule>? Schedules { get; set; }
    }
}
