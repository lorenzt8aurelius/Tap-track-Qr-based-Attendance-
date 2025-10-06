using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NEW_QR_BASED_ATTENDANCE.Data;
using NEW_QR_BASED_ATTENDANCE.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NEW_QR_BASED_ATTENDANCE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceContext _context;

        public AttendanceController(AttendanceContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttendanceRecord>>> GetAttendanceRecords()
        {
            return await _context.AttendanceRecords
                .Include(a => a.Person)
                .ToListAsync();
        }

        // ✅ GET: api/Attendance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AttendanceRecord>> GetAttendanceRecord(int id)
        {
            // ✅ Use AttendanceId (matches your model)
            // Using AsNoTracking for read-only operation
            var record = await _context.AttendanceRecords
                .Include(a => a.Person)
                .FirstOrDefaultAsync(a => a.AttendanceId == id);

            if (record == null)
                return NotFound();

            return record;
        }

        // ✅ POST: api/Attendance
        [HttpPost]
        public async Task<ActionResult<AttendanceRecord>> PostAttendanceRecord(AttendanceRecord record)
        {
            // The incoming record might only have a PersonCode. We need to find the actual person.
            if (record.Person == null || string.IsNullOrEmpty(record.Person.PersonCode))
            {
                return BadRequest("PersonCode is required.");
            }

            // ✅ Check if the person exists based on PersonCode
            var person = await _context.Persons
                .FirstOrDefaultAsync(p => p.PersonCode == record.Person.PersonCode);

            if (person == null)
                return NotFound("Person not found.");

            // ✅ Set the correct foreign key reference
            record.Person = person;

            _context.AttendanceRecords.Add(record);
            await _context.SaveChangesAsync();

            // ✅ Use AttendanceId (correct property name)
            return CreatedAtAction(nameof(GetAttendanceRecord), new { id = record.AttendanceId }, record);
        }
    }
}
