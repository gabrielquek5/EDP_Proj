﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NanoidDotNet;
using System.IO;

namespace LearningAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public FileController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")]
        public IActionResult Upload(IFormFile file)
        {
            if (file.Length > 1024 * 1024)
            {
                var message = "Maximum file size is 1MB";
                return BadRequest(new { message });
            }

            var id = Nanoid.Generate(size: 10);
            var filename = id + Path.GetExtension(file.FileName);
            var uploadsDirectory = Path.Combine(_environment.ContentRootPath, "wwwroot/uploads");

            // Ensure the directory exists, create it if not
            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }

            var imagePath = Path.Combine(uploadsDirectory, filename);

            using var fileStream = new FileStream(imagePath, FileMode.Create);
            file.CopyTo(fileStream);

            return Ok(new { filename });
        }
    }
}
