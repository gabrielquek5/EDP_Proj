using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication1.Models;

namespace EDP_Project.Models
{
    public class Booking
    {
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
        public int UserID { get; set; }
        public int EventID { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }
        public Event? Event { get; set; }
    }

}
