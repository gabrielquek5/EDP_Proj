using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication1.Models;

namespace WebApplication1.Models
{
    public class ShoppingCart
    {
        [Key]
        public int itemID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required, Column(TypeName = "date")]
        public DateTime CartSelectedDate { get; set; }

        [Required, Column(TypeName = "datetime")]
        public DateTime CartSelectedTime { get; set; }

        // Foreign key property
        public int ScheduleId { get; set; }
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public Schedule? Schedule { get; set; }
        public User? User { get; set; }

    }

}
