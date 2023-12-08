using Microsoft.EntityFrameworkCore;
using WorkManagement.Db;
using WorkManagement.Models;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MailKit;
using MailKit.Security;
using MimeKit;
namespace WorkManagement.Controllers;


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
    
    //TO GET TOP 3 WORKS
    [HttpGet("getnearworks")]
    public IActionResult GetNearWorks()
    {
        var currentDate = DateTime.UtcNow;
        var works = _context.Works
            .AsNoTracking()
            .Where(work => work.due_date >= currentDate)
            .OrderBy(work => work.due_date)
            .Take(3)
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
        var completed = _context.Works.Count(x => x.work_status == 'C');
        var percentages = new List<int>{completed,_context.Works.Count()-completed};
        return Ok(new
        {
            worksData=works,percentData=percentages
        });
    }

    //TO GET ALL WORKS
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

    //TO GET WORKS OF SPECCIFIC WORKER
    [HttpGet("getworksbyid")]
    public IActionResult GetWorksById(long workerid)
    {
        var works = _context.Works.Where(w => w.worker == workerid).Select(work => new
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
            work.advance_paid,
            work.bill_paid,
            work.coordinator
        });
        return Ok(works);
    }
    
    [HttpGet("gettasks")]
    public IActionResult GetTasks(string n)
    {
        return Ok(_context.Tasks.Where(x=>x.work_id==long.Parse(n)).OrderBy(t=>t.order_no).Select(y=>new{task_id = y.task_id.ToString(),work_id=y.work_id.ToString(),y.order_no,y.completed,y.due_date,y.task_name,y.weightage}));
    }
    
    //get workers data
    [HttpGet("getworkers")]
    public IActionResult GetWorkers()
    {
        var workers = _context.Workers.AsNoTracking().Select(w => new
        {
            worker_id = w.worker_id.ToString(),
            w.worker_name,
            w.email,
            w.phone_number
        });
        return Ok(workers);
    }

    //TO GET PAYMENT DETAILS OF WORK ID
    [HttpGet("getpayments")]
    public IActionResult GetPayments(string workid)
    {
        var work_id = long.Parse(workid);
        return Ok(_context.Payments.Where(x => x.work == work_id));
    }

    //TO GET REVIEWS/QUERIES ON A WORK ID
    [HttpGet("getreviews")]
    public IActionResult GetReviews(long workid)
    {
        return Ok(_context.Queries.Where(x=>x.work==workid));
    }
    
    //TO GET IMAGES OF A GIVEN WORK
    [HttpGet("getimages")]
    public IActionResult GetImageUrls()
    {
        var images = _context.Images.Select(x => new
        {
            workname=x.WorkReference.work_name,
            x.links
        });
        return Ok(images);
    }
    
    //TO GET VERIFICATION CODE
    [HttpGet("getverificationcode")]
    public IActionResult GetVerification()
    {
        return Ok(_context.Logins.Find("check@verify.in").password);
    }
    
    
    //--------------------------------------------------------
    
    //TO CHANGE PASSWORD FOR ADMIN/COORDINATOR
    [HttpPut("resetpassword")]
    public void SendPasswordResetEmail()
    {
        // Create email message
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("TCE DMDR", "insomniadevs007@gmail.com"));
        emailMessage.To.Add(new MailboxAddress("M.r sruthik", "sruthik2016@gmail.com"));
        emailMessage.Subject = "Password Reset";
        emailMessage.Body = new TextPart("html") { Text = @"
<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
  <style>
      body {
          font-family: Arial, sans-serif;
      }
      .container {
          width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
      }
      .button {
          display: inline-block;
          background-color: #007BFF;
          color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 20px;
      }
        .ii a[href] {
         color: #fff;
      }
  </style>
</head>
<body>
  <div class=""container"">
                <h2>Password Reset</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to reset it.</p>
                <a href=""https://tceworkmanagement.azurewebsites.net/"" class=""button"">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
                <b>Delete this email after resetting for security purposes<b>
                </div>
                </body>
                </html>
"};

        // Send email
        using var smtp = new SmtpClient();
        smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        smtp.Authenticate("insomniadevs007@gmail.com", "lzhyecgavxzkcgvg");
        smtp.Send(emailMessage);
        smtp.Disconnect(true);
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
    
    //UPDATE COMPLETION OF TASKS (WORK)
    [Route("updatetaskcompletion")]
    [HttpPut]
    public IActionResult UpdateCompletion(string task_id)
    {
        var taskid = long.Parse(task_id);
        var task = _context.Tasks.Find(taskid);
        if (task == null)
        {
            return BadRequest("Task not found");
        }

        task.completed = true;
        var workId = task.work_id;
        var work = _context.Works.Find(workId);
        work.completed_subtasks += task.weightage;
        _context.SaveChanges();

        // Check if all tasks for the same work_id are completed
        var allTasksCompleted = _context.Tasks.Where(t => t.work_id == workId && t.completed!=true).Count() == 0;

        if (allTasksCompleted)
        {
            // Update work_status in the work table to true
            if (work != null)
            {
                work.work_status = 'C';
                var worker = _context.Workers.Find(work.worker);
                worker.current_works.Remove((long)workId);
                _context.SaveChanges();
            }
        }

        return Ok(new { message = "Completion updated successfully" });
    }
    
    //ADD NEW IMAGE URL 

    public class ImageItems
    {
        public long id { get; set; }
        public string url { get; set; }
    }
    
    [Route("appendimage")]
    [HttpPut]
    public IActionResult AppendImage([FromBody] ImageItems imageitem)
    {
        var workid = imageitem.id;
        var url = imageitem.url;
        var imagebox = _context.Images.FirstOrDefault(i=>i.work==workid);
        imagebox.links.Add(url);
        _context.SaveChanges();
        return Ok(new { message = "image appened sucessfully" });
    }
    
    //UPDATE BILL PAID
    [Route("updatebill")]
    [HttpPut]
    public IActionResult UpdateBill(string workid)
    {
        var work_id = long.Parse(workid);
        var work = _context.Works.Find(work_id);
        work.bill_paid = true;
        _context.SaveChanges();
        return Ok(new { message = "bill updated successfully" });
    }
    
    //UPDATE VERIFICATION CODE
    [HttpPut("updatevcode")]
    public IActionResult UpdateVCode()
    {
        var vcode = _context.Logins.FirstOrDefault(x => x.email == "check@verify.in");
        int randomNumber = new Random().Next(1000, 10000);
        vcode.password = randomNumber.ToString();
        _context.SaveChanges();
        return Ok();
    }
    
    //TO RESET PASSWORD
    
    //reset pass for admin/coordinator
    public class ResetDto
    {
        public string email { get; set; }
        public string oldpass { get; set; }
        public string newpass { get; set; }
    }
    
    [HttpPut("resetpass1")]
    public IActionResult SetNewPass([FromBody] ResetDto resetDto)
    {
        var email = resetDto.email;
        var oldpass = resetDto.oldpass;
        var newpass = resetDto.newpass;
        var existingLogin = _context.Logins.FirstOrDefault(l => l.email == email);
        if (existingLogin == null)
        {
            // Email not found in the database, return false
            return NotFound(new { message = "Data not found" });
        }
        // Compare the provided password with the stored password
        if (oldpass==existingLogin.password)
        {
            existingLogin.password = newpass;
            _context.SaveChanges();
            return Ok(new { success = "true" });
        }
        else
        {
            return Ok(new { success = "false" });
        }
        
    }
    
    //reset pass for workers
    [HttpPut("resetpass")]
    public IActionResult ResetPass([FromBody] ResetDto resetDto)
    {
        var newpass = resetDto.newpass;
        var user = _context.WLogins.FirstOrDefault(x => x.email == resetDto.email);
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(newpass);
        user.password = passwordHash;
        _context.SaveChangesAsync();
        return Ok(new {message = "success"});
    }

    //-------------------------------------------------------------------

    //ADMIN - COORDINATOR LOGIN VERIFICATION
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
            if (existingLogin.designation=='C')
                return Ok(new { redirectTo = "HeadPortal",where='C'});
            return Ok(new { redirectTo = "worker" });
        }
        else
        {
            // Passwords do not match, return false
            return Ok(new { success = "false" });
        }
    }
    
    //WORKER LOGIN

    public class LoginCred
    {
        public string useremail { get; set; }
        public string userpassword { get; set; }
    }
    
    [Route("workerlogin")]
    [HttpPost]
    public IActionResult Login([FromBody] LoginCred cred)
    {
        // Get the WLogin object for the given email.
        WLogin wlogin = _context.WLogins.FirstOrDefault(w => w.email == cred.useremail);

        // If the WLogin object is null, then the user does not exist.
        if (wlogin == null)
        {
            return NotFound();
        }

        // Verify the password.
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(cred.userpassword, wlogin.password);

        // If the password is not valid, then the user is not authorized.
        if (!isPasswordValid)
        {
            return Unauthorized();
        }

        // Return the worker ID.
        return Ok(wlogin.wid);
    }

    
    //ADD QUERY
    [HttpPost("addquery")]
    public IActionResult AddQuery([FromBody] Query newQuery)
    {
        if (newQuery == null)
        {
            return BadRequest("Invalid query data.");
        }
        newQuery.query_date = DateTime.UtcNow.Date; // Set the date to UTC date
        newQuery.query_time = DateTime.UtcNow.TimeOfDay; // Set the time to UTC time
        _context.Queries.Add(newQuery);
        _context.SaveChanges();
        DateTime istTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, istTimeZone);
        Console.WriteLine("IST Time: " + istTime.ToString("yyyy-MM-dd HH:mm:ss"));
        return Ok(new { message = "Query added successfully." });
    }
    
    //ADD NEW WORK ALONG WITH SUBTASKS AND IMAGES ENTRY
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
        var worker = _context.Workers.Find(workpart.worker);
        worker.works_done += 1;
        worker.current_works.Add(workpart.work_id);
        var new_image_entry = new Image();
        new_image_entry.links = new List<string>();
        new_image_entry.work = workpart.work_id;
        _context.Images.Add(new_image_entry);
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
    
    //ADD PAYMENT
    [Route("addpayment")]
    [HttpPost]
    public IActionResult AddPayment([FromBody] Payment newpayment)
    {
        if (newpayment==null)
        {
            return BadRequest("Invalid payment data.");
        }

        newpayment.work = (long) newpayment.work;
        _context.Payments.Add(newpayment);
        var work = _context.Works.Find(newpayment.work);
        if (work != null)
        {
            if (newpayment.payment_type=='A')
            {
                work.advance_paid = true;
            }
            else if (newpayment.payment_type=='B')
            {
                work.bill_paid = true;
            }
        }
        _context.SaveChanges();
        return Ok(new
        {
            message = "payment added sucessfully"
            
        });
    }
    
    //REGISTER WORKER
    public class WorkerDto
    {
        public string worker_name { get; set; }
        public string email { get; set; }
        public string phone_number { get; set; }
        public string password { get; set; }
        
        public string verificationcode { get; set; }
    }
    
    [Route("addworker")]
    [HttpPost]
    public async Task<ActionResult<Worker>> AddWorker([FromBody] WorkerDto workerDto)
    {
        // Validate the worker DTO object.
        if (workerDto == null)
        {
            return BadRequest();
        }

        var vcode = _context.Logins.Find("check@verify.in").password;
        if (workerDto.verificationcode!=vcode)
        {
            return Ok("check fail");
        }

        // Create a new Worker object from the worker DTO object.
        Worker worker = new Worker()
        {
            worker_name = workerDto.worker_name,
            email = workerDto.email,
            phone_number = workerDto.phone_number,
            works_done = 0,
            current_works = new List<long>()
        };

        // Add the worker to the database.
        _context.Workers.Add(worker);
        await _context.SaveChangesAsync();

        // Get the worker ID generated by the database.
        long workerId = worker.worker_id;

        // Hash the password.
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(workerDto.password);

        // Create a new WLogin object.
        WLogin wlogin = new WLogin()
        {
            wid = workerId,
            email = workerDto.email,
            password = passwordHash
        };

        // Add the WLogin object to the database.
        _context.WLogins.Add(wlogin);
        await _context.SaveChangesAsync();
        
        return Ok(new {message = "registration succesffull"});
    }
    
    

}