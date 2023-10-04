using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Worker
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long worker_id { get; set; }

    [Required]
    public string worker_name { get; set; }

    public long? works_done { get; set; }

    public List<long> current_works { get; set; }

    [Required]
    public string email { get; set; }

    [Required]
    public string phone_number { get; set; }
}