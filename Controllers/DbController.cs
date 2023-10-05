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
    
    [Route("getworks")]
    [HttpGet]
    public IActionResult GetWorks()
    {
        var works = _context.Works.Select(work => new
        {
            work_id = work.work_id.ToString(),
            work.work_name,
            work.work_description,
            work.work_status,
            work.start_date,
            work.due_date,
            work.total_subtasks,
            work.completed_subtasks,
            work.wage,
            worker = work.worker.ToString(),
            work.advance_paid,
            work.bill_paid,
            coordinator = work.coordinator.ToString() // Convert coordinator to string
        });

        return Ok(works);
    }


    [Route("gettasks")]
    [HttpGet]
    public IActionResult GetTasks(string n)
    {
        return Ok(_context.Tasks.Where(x=>x.work_id==long.Parse(n)).Select(y=>new{task_id = y.task_id.ToString(),work_id=y.work_id.ToString(),y.order_no,y.completed}));
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