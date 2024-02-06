using WebApplication1;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Stripe;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMvc().AddNewtonsoftJson();
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

builder.Services.AddDbContext<MyDbContext>();

// Add CORS policy
var allowedOrigins = builder.Configuration.GetSection(
"AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(
	policy =>
	{
		policy.WithOrigins(allowedOrigins)
	.AllowAnyMethod()
	.AllowAnyHeader();
	});
});

// Authentication
var secret = builder.Configuration.GetValue<string>("Authentication:Secret");
builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters()
	{
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(
	Encoding.UTF8.GetBytes(secret)
	),
	};
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	var securityScheme = new OpenApiSecurityScheme
	{
		In = ParameterLocation.Header,
		Description = "Token",
		Name = "Authorization",
		Type = SecuritySchemeType.Http,
		BearerFormat = "JWT",
		Scheme = "Bearer",
		Reference = new OpenApiReference
		{
			Type = ReferenceType.SecurityScheme,
			Id = "Bearer"
		}
	};
	options.AddSecurityDefinition("Bearer", securityScheme);
	options.AddSecurityRequirement(new OpenApiSecurityRequirement
{
{ securityScheme, new List<string>() }
});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();
// Configure Stripe API key
StripeConfiguration.ApiKey = "sk_test_51OPMIjE7dlDzSq3bdLinND1GsOB1umKYNwDgYOubmE9LyTupQQHt0cFKj5re4ucAl3E5PINgwPS74OJgWyxvaE3U00AYisjkJZ";

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
