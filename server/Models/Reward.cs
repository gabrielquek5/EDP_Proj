using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;

namespace WebApplication1.Models
{
	public class Reward
	{
		public int Id { get; set; }

		[Required, MinLength(3), MaxLength(100)]
		public string Title { get; set; } = string.Empty;

		[Required, MinLength(3), MaxLength(500)]
		public string Description { get; set; } = string.Empty;

		[Required, MinLength(3), MaxLength(500)]
		public string Duration { get; set; } = string.Empty;

		[MaxLength(20)]
		public string? ImageFile { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }

		// Soft delete flag

		public int UserId { get; set; }

		public User? User { get; set; }
	}

}