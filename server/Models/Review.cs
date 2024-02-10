using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json.Serialization;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }

        [Required]
        public float Rating { get; set; }

        [MinLength(5),MaxLength(400)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$",
            ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string Comments { get; set; } = string.Empty;

        public string? Picture { get; set; } = string.Empty;
        public bool Reported { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime createdAt { get; set; } = DateTime.Now;

        [Column(TypeName = "datetime")]
        public DateTime updatedAt { get; set; } = DateTime.Now;

        // Foreign key property
        public int UserId { get; set; }
        public int ScheduleId {  get; set; }
        public int BookingId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }
        public Schedule? Schedule { get; set;}
        public Booking? Booking { get; set; }

    }
}
