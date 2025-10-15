using Microsoft.EntityFrameworkCore;
using NEW_QR_BASED_ATTENDANCE.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// ✅ Direct PostgreSQL connection string (Supabase)
var connectionString = "Host=db.yuegconopncwiafjkjrr.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=12345;SSL Mode=Require;Trust Server Certificate=true";

builder.Services.AddDbContext<AttendanceContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
