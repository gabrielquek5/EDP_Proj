using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication1.Models;

namespace EDP_Project.Models
{
    public class ShoppingCart
    {
        [Key]
        public int itemID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public DateTime DateCart { get; set; }

        // Foreign key property
        public int ScheduleId { get; set; }
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public Schedule? Schedule { get; set; }
        public User? User { get; set; }

    }

}
