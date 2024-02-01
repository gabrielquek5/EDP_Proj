﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using EDP_Project.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
namespace WebApplication1.Models
{
    public class Schedule
    {
        [Key]
        public int ScheduleId { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required, Column(TypeName = "datetime")]
        public DateTime SelectedDate { get; set; }

        [Required, Column(TypeName = "datetime")]
        public DateTime SelectedTime { get; set; }

        [Required, MinLength(6), MaxLength(6)]
        public string PostalCode { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        [Required]
        public float Price { get; set; }

        [Required]
        public bool IsDeleted { get; set; }

        [JsonIgnore]
        public List<Booking>? Bookings { get; set; }
        [JsonIgnore]
        public List<Review>? Reviews { get; set; }
        [JsonIgnore]
        public List<ShoppingCart>? ShoppingCart { get; set; }

        // Foreign key property
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }
    }
}
