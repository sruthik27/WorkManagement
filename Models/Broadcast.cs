using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("broadcast",Schema = "public")]
public class Broadcast
{
    [Column("date")]
    public DateTime Date { get; set; } // Date component
    
    [Key]
    [Column("time")]
    public TimeSpan Time { get; set; } // Primary key and also used for time

    [Column("message")]
    public string Message { get; set; } // Long text message
}