using WorkManagement.Db;
using WorkManagement.Models;

namespace WorkManagement.Controllers;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class DbController : ControllerBase
{
    private readonly DefaultDbContext _context;
    public DbController(DefaultDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_context.Works);
    }

    [Route("verify")]
    [HttpPost]
    public IActionResult Verify([FromBody] Login login)
    {
        if (login == null)
        {
            return BadRequest("Invalid data");
        }

        var existingLogin = _context.Logins.FirstOrDefault(l => l.email == login.email);
        if (existingLogin == null)
        {
            // Email not found in the database, return false
            return Ok(new { success = false });
        }

        // Compare the provided password with the stored password
        if (existingLogin.password == login.password)
        {
            // Passwords match, return true
            return Ok(new { redirectTo = "AdminMain" });
        }
        else
        {
            // Passwords do not match, return false
            return Ok(new { success = "false" });
        }
    }
}