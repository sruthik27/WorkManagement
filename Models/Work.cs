using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("work",Schema = "public")]
public class Work
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long work_id { get; set; }

    [Required]
    public string work_name { get; set; }

    public string work_description { get; set; }

    [Required]
    public char work_status { get; set; }

    public DateTime? start_date { get; set; }

    public DateTime? due_date { get; set; }

    public long? total_subtasks { get; set; }

    public long? completed_subtasks { get; set; }

    public long? wage { get; set; }

    public long? worker { get; set; }

    public bool? advance_paid { get; set; }

    public bool? bill_paid { get; set; }

    public long? coordinator { get; set; }

    [ForeignKey("worker")]
    public Worker WorkerNavigation { get; set; }

    [ForeignKey("coordinator")]
    public Coordinator CoordinatorNavigation { get; set; }
}