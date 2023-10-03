﻿using Microsoft.EntityFrameworkCore;
using WorkManagement.Models;

namespace WorkManagement.Db;

public class DefaultDbContext : DbContext
{
    public DefaultDbContext(DbContextOptions<DefaultDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Login> Logins { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(@"Host=silly-zebu-5404.8nk.cockroachlabs.cloud;Port=26257;Database=workmanagementdb;Username=alpha;Password=sY8Y8hOdvXXYRoEyYJG_jw;
        SSL Mode = VerifyCA;");
    }
}