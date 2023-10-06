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
        return Ok(_context.Tasks.Where(x=>x.work_id==long.Parse(n)).Select(y=>new{task_id = y.task_id.ToString(),work_id=y.work_id.ToString(),y.order_no,y.completed,y.due_date,y.task_name}));
    }
    
    [HttpGet("completedcount")]
    public IActionResult GetCompletedTasksCount(string dueDate)
    {
        // Convert the dueDate string to a DateTime object in UTC.
        if (!DateTime.TryParse(dueDate, out DateTime dueDateDateTime))
        {
            return BadRequest("Invalid due date format");
        }
        dueDateDateTime = DateTime.SpecifyKind(dueDateDateTime, DateTimeKind.Utc);

        // Query the database to count completed tasks on the specified due date.
        int completedTasksCount = _context.Tasks
            .Count(task => task.completed == true && task.due_date == dueDateDateTime);

        return Ok(new { CompletedTasksCount = completedTasksCount });
    }

    [Route("updateorder")]
    [HttpPut]
    public IActionResult UpdateOrder(string task_id,int new_order)
    {
        Console.WriteLine("console writing");
        var taskid = long.Parse(task_id);
        //FindTask by taskid
        var task = _context.Tasks.FirstOrDefault(t => t.task_id == taskid);
        if (task == null)
        {
            return BadRequest("Task not found");
        }
        //Update task's order
        task.order_no = new_order;
        _context.SaveChanges();
        return Ok(new { message = "Order updated succesfully" });
    }
    /*
     * const task_id = "905912396327616513"; // Replace with your task_id
const new_order = 4; // Replace with the new_order value

const url = `https://localhost:7286/db/updateorder?task_id=${task_id}&new_order=${new_order}`;

fetch(url, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

     */
    

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