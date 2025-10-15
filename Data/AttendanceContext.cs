using Microsoft.EntityFrameworkCore;
using NEW_QR_BASED_ATTENDANCE.Models;

namespace NEW_QR_BASED_ATTENDANCE.Data
{
    public class AttendanceContext : DbContext
    {
        public AttendanceContext(DbContextOptions<AttendanceContext> options)
            : base(options)
        {
        }

        // ✅ Matches controller naming
        public DbSet<Person> Persons { get; set; } = null!; // Changed from People to Persons
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Fallback connection string for scenarios where DI is not used (e.g., design-time tools)
                optionsBuilder.UseNpgsql("Host=db.yuegconopncwiafjkjrr.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=12345;SSL Mode=Require;Trust Server Certificate=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Person>(entity =>
            {
                entity.ToTable("Persons");
                entity.HasKey(p => p.PersonId);
                entity.Property(p => p.FullName).IsRequired().HasMaxLength(255);
                entity.Property(p => p.PersonCode).HasMaxLength(100);
            });

            modelBuilder.Entity<AttendanceRecord>(entity =>
            {
                entity.ToTable("AttendanceRecords");
                entity.HasKey(a => a.AttendanceId);
                entity.HasOne(a => a.Person)
                      .WithMany(p => p.AttendanceRecords)
                      .HasForeignKey(a => a.PersonId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
