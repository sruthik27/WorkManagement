using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("task",Schema = "public")]
public class Task
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("task_id")]
    public long task_id { get; set; }

    [Column("work_id")]
    public long? work_id { get; set; }

    [Column("order_no")]
    public long? order_no { get; set; }

    [Column("completed")]
    public bool? completed { get; set; }

    // Navigation property to represent the foreign key relationship
    [ForeignKey("work_id")]
    public Work Work { get; set; }
}