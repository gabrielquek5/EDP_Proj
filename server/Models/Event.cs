using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EDP_Project.Models
{
    public class Event
    {
        [Key]
        public int EventID { get; set; }

        [Required]
        public string EventName { get; set; } = string.Empty;

        [Required]
        public string EventDescription { get; set; } = string.Empty;

        [Required]
        public float EventPrice { get; set; }
        [JsonIgnore]
        public List<Booking> Bookings { get; set; }
        [JsonIgnore]
        public List<Review> Reviews { get; set; }
        [JsonIgnore]
        public List<ShoppingCart> ShoppingCart { get; set; }
    }
}
