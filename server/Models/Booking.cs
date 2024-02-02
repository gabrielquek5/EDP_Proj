using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class Booking
    {
        [Key]
        public int BookingID { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public int Pax { get; set; }

        [Required]
        public float Price { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime createdAt { get; set; } = DateTime.Now;

        [Column(TypeName = "datetime")]
        public DateTime updatedAt { get; set; } = DateTime.Now;


        // Foreign key property
        public int UserId { get; set; }
        public int ScheduleId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }
        public Schedule? Schedule { get; set; }
    }

}
