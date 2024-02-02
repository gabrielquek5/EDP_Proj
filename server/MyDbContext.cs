using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1
{
	public class MyDbContext : DbContext
	{
		private readonly IConfiguration _configuration;
		public MyDbContext(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		protected override void OnConfiguring(DbContextOptionsBuilder
		optionsBuilder)
		{
			string? connectionString = _configuration.GetConnectionString("MyConnection");
			if (connectionString != null)
			{
				optionsBuilder.UseMySQL(connectionString);
			}
		}
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<User> Users { get; set; }
		public DbSet<Reward> Rewards { get; set; }
	}
}


