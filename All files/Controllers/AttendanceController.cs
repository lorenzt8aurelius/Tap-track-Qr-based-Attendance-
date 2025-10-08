using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        [HttpGet("list")]
        public IActionResult GetAttendance()
        {
            var sample = new[]
            {
                new { studentName = "Juan Dela Cruz", date = DateTime.Today.ToShortDateString(), time_in = "08:00", time_out = "15:00", session_code = "MATH101" },
                new { studentName = "Maria Santos", date = DateTime.Today.ToShortDateString(), time_in = "08:05", time_out = "15:02", session_code = "MATH101" }
            };
            return Ok(sample);
        }
    }
}


