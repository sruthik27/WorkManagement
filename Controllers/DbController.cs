﻿using Microsoft.EntityFrameworkCore;
using WorkManagement.Db;
using WorkManagement.Models;

namespace WorkManagement.Controllers;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class DbController : ControllerBase
{
    private readonly DefaultDbContext _context;
    // Specify the TimeZoneId for IST (Indian Standard Time)
    static string istTimeZoneId = "India Standard Time";
    // Use TimeZoneInfo to convert from UTC to IST
    TimeZoneInfo istTimeZone = TimeZoneInfo.FindSystemTimeZoneById(istTimeZoneId);
    public DbController(DefaultDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("getworks")]
    public IActionResult GetWorks()
    {
        
        var works = _context.Works
            .Include(work => work.WorkerNavigation)// Eager load the worker data
            .AsNoTracking()
            .Select(work => new
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
                worker = work.WorkerNavigation.worker_name,
                work.advance_paid,
                work.bill_paid,
                work.coordinator
            });
        return Ok(works);
    }
    
    [HttpGet("gettasks")]
    public IActionResult GetTasks(string n)
    {
        return Ok(_context.Tasks.Where(x=>x.work_id==long.Parse(n)).OrderBy(t=>t.order_no).Select(y=>new{task_id = y.task_id.ToString(),work_id=y.work_id.ToString(),y.order_no,y.completed,y.due_date,y.task_name}));
    }
    

    [HttpGet("getworkers")]
    public IActionResult GetWorkers()
    {
        var workers = _context.Workers.AsNoTracking().Select(w => new
        {
            worker_id = w.worker_id.ToString(),
            w.worker_name
        });
        return Ok(workers);
    }

    //TO UPDATE ORDER OF SUBTASK
    [Route("updateorder")]
    [HttpPut]
    public IActionResult UpdateOrder(string task_id,int new_order)
    {
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
            // Passwords match, and admin
            if (existingLogin.designation=='A')
            {
                return Ok(new { redirectTo = "AdminMain",where='A' });
            }

            return Ok(new { redirectTo = "coordinator",where='C'});
        }
        else
        {
            // Passwords do not match, return false
            return Ok(new { success = "false" });
        }
    }
    
    [HttpPost("addbroadcast")]
    public IActionResult AddBroadcast([FromBody] Broadcast newBroadcast)
    {
        if (newBroadcast == null)
        {
            return BadRequest("Invalid broadcast data.");
        }
        // Set the date and time components of the new broadcast
        // Set the date and time components of the new broadcast
        newBroadcast.Date = DateTime.UtcNow.Date; // Set the date to UTC date
        newBroadcast.Time = DateTime.UtcNow.TimeOfDay; // Set the time to UTC time
        _context.Broadcasts.Add(newBroadcast);
        _context.SaveChanges();
        DateTime istTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, istTimeZone);
        Console.WriteLine("IST Time: " + istTime.ToString("yyyy-MM-dd HH:mm:ss"));
        return Ok(new { message = "Broadcast added successfully." });
    }
    
    //TO ADD NEW WORK ALONG WITH SUBTASKS
    public class WorkWithSubtasks
    {
        public Work Work { get; set; }
        public List<SubTask> Subtasks { get; set; }
    }

    [Route("addwork")]
    [HttpPost]
    public IActionResult AddWork([FromBody] WorkWithSubtasks newWork)
    {
        if (newWork == null)
        {
            return BadRequest("Invalid work data.");
        }

        Work workpart = newWork.Work;
        workpart.worker = (long) workpart.worker;
        _context.Works.Add(workpart);
        _context.SaveChanges();

        List<SubTask> taskspart = newWork.Subtasks;
        foreach (var subtask in taskspart)
        {
            subtask.work_id = workpart.work_id;
            _context.Tasks.Add(subtask);
        }
        _context.SaveChanges();
        return Ok(new { message = "Work added successfully.", work_id = workpart.work_id });
    }
    

}