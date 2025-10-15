using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NEW_QR_BASED_ATTENDANCE.Data;
using NEW_QR_BASED_ATTENDANCE.Models;

namespace NEW_QR_BASED_ATTENDANCE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonsController : ControllerBase
    {
        private readonly AttendanceContext _context;

        public PersonsController(AttendanceContext context)
        {
            _context = context;
        }

        // GET: api/Persons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople()
        {
            return await _context.Persons.ToListAsync();
        }

        // GET: api/Persons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await _context.Persons
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PersonId == id);

            if (person == null)
                return NotFound();

            return person;
        }

        // PUT: api/Persons/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(int id, Person person)
        {
            if (id != person.PersonId)
                return BadRequest();

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Persons.Any(e => e.PersonId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Persons
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(Person person)
        {
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerson), new { id = person.PersonId }, person);
        }

        // DELETE: api/Persons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Persons.FindAsync(id);
            if (person == null)
                return NotFound();

            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
